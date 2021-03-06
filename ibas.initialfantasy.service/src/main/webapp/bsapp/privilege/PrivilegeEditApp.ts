/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import { BORepositoryInitialFantasy } from "../../borep/BORepositories";

/** 应用-系统权限 */
export class PrivilegeEditApp extends ibas.BOEditApplication<IPrivilegeEditView, bo.Privilege> {

    /** 应用标识 */
    static APPLICATION_ID: string = "2241eab0-ca9f-4427-9457-500b6f35af35";
    /** 应用名称 */
    static APPLICATION_NAME: string = "initialfantasy_app_privilege_edit";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.Privilege.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = PrivilegeEditApp.APPLICATION_ID;
        this.name = PrivilegeEditApp.APPLICATION_NAME;
        this.boCode = PrivilegeEditApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.deleteDataEvent = this.deleteData;
        this.view.createDataEvent = this.createData;
        this.view.chooseRoleEvent = this.chooseRole;
        this.view.choosePlatformEvent = this.choosePlatform;
        this.view.chooseModuleEvent = this.chooseModule;
        this.view.chooseTargetEvent = this.chooseTarget;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        if (ibas.objects.isNull(this.editData)) {
            // 创建编辑对象实例
            this.editData = new bo.Privilege();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showPrivilege(this.editData);
    }
    /** 运行,覆盖原方法 */
    run(...args: any[]): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.Privilege)) {
            // 尝试重新查询编辑对象
            let criteria: ibas.ICriteria = arguments[0].criteria();
            if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                // 有效的查询对象查询
                let boRepository: BORepositoryInitialFantasy = new BORepositoryInitialFantasy();
                boRepository.fetchPrivilege({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Privilege>): void {
                        let data: bo.Privilege;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.Privilege)) {
                            // 查询到了有效数据
                            that.editData = data;
                            that.show();
                        } else {
                            // 数据重新检索无效
                            that.messages({
                                type: ibas.emMessageType.WARNING,
                                message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                onCompleted(): void {
                                    that.show();
                                }
                            });
                        }
                    }
                });
                // 开始查询数据
                return;
            }
        }
        super.run();
    }
    /** 待编辑的数据 */
    protected editData: bo.Privilege;
    /** 保存数据 */
    protected saveData(): void {
        let that: this = this;
        let boRepository: BORepositoryInitialFantasy = new BORepositoryInitialFantasy();
        boRepository.savePrivilege({
            beSaved: this.editData,
            onCompleted(opRslt: ibas.IOperationResult<bo.Privilege>): void {
                try {
                    that.busy(false);
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    if (opRslt.resultObjects.length === 0) {
                        // 删除成功，释放当前对象
                        that.messages(ibas.emMessageType.SUCCESS,
                            ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                        that.editData = undefined;
                    } else {
                        // 替换编辑对象
                        that.editData = opRslt.resultObjects.firstOrDefault();
                        that.messages(ibas.emMessageType.SUCCESS,
                            ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                    }
                    // 刷新当前视图
                    that.viewShowed();
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.busy(true);
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
    }
    /** 删除数据 */
    protected deleteData(): void {
        let that: this = this;
        this.messages({
            type: ibas.emMessageType.QUESTION,
            title: ibas.i18n.prop(this.name),
            message: ibas.i18n.prop("sys_whether_to_delete"),
            actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
            onCompleted(action: ibas.emMessageAction): void {
                if (action === ibas.emMessageAction.YES) {
                    that.editData.delete();
                    that.saveData();
                }
            }
        });
    }
    /** 新建数据，参数1：是否克隆 */
    protected createData(clone: boolean): void {
        let that: this = this;
        let createData: Function = function (): void {
            if (clone) {
                // 克隆对象
                that.editData = that.editData.clone();
                that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                that.viewShowed();
            } else {
                // 新建对象
                that.editData = new bo.Privilege();
                that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                that.viewShowed();
            }
        };
        if (that.editData.isDirty) {
            this.messages({
                type: ibas.emMessageType.QUESTION,
                title: ibas.i18n.prop(this.name),
                message: ibas.i18n.prop("sys_data_not_saved_whether_to_continue"),
                actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                onCompleted(action: ibas.emMessageAction): void {
                    if (action === ibas.emMessageAction.YES) {
                        createData();
                    }
                }
            });
        } else {
            createData();
        }
    }
    /** 选择角色标识 */
    private chooseRole(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<bo.IRole>({
            boCode: bo.BO_CODE_ROLE,
            onCompleted(selecteds: ibas.List<bo.IRole>): void {
                that.editData.roleCode = selecteds.firstOrDefault().code;
            }
        });
    }
    /** 选择平台标识 */
    private choosePlatform(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<bo.ApplicationPlatform>({
            boCode: bo.ApplicationPlatform.BUSINESS_OBJECT_CODE,
            criteria: [
                new ibas.Condition(bo.ApplicationPlatform.PROPERTY_ACTIVATED_NAME,
                    ibas.emConditionOperation.EQUAL, "Y"),
            ],
            onCompleted(selecteds: ibas.List<bo.ApplicationPlatform>): void {
                that.editData.platformId = selecteds.firstOrDefault().platformCode;
            }
        });
    }
    /** 选择模块标识 */
    private chooseModule(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<bo.ApplicationModule>({
            boCode: bo.ApplicationModule.BUSINESS_OBJECT_CODE,
            criteria: [
                new ibas.Condition(bo.ApplicationModule.PROPERTY_ACTIVATED_NAME,
                    ibas.emConditionOperation.EQUAL, "Y"),
            ],
            onCompleted(selecteds: ibas.List<bo.ApplicationModule>): void {
                that.editData.moduleId = selecteds.firstOrDefault().moduleId;
            }
        });
    }
    /** 选择目标标识 */
    private chooseTarget(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<bo.ApplicationFunction>({
            boCode: bo.ApplicationFunction.BUSINESS_OBJECT_CODE,
            criteria: [],
            onCompleted(selecteds: ibas.List<bo.ApplicationFunction>): void {
                that.editData.target = selecteds.firstOrDefault().functionId;
            }
        });
    }
}
/** 视图-系统权限 */
export interface IPrivilegeEditView extends ibas.IBOEditView {
    /** 显示数据 */
    showPrivilege(data: bo.Privilege): void;
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 选择角色标识 */
    chooseRoleEvent: Function;
    /** 选择平台标识 */
    choosePlatformEvent: Function;
    /** 选择模块标识 */
    chooseModuleEvent: Function;
    /** 选择目标标识 */
    chooseTargetEvent: Function;
}
