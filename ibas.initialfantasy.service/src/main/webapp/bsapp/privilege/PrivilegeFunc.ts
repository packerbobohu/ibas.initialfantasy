/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { PrivilegeListApp } from "./PrivilegeListApp";

export class PrivilegeFunc extends ibas.ModuleFunction {

    /** 功能标识 */
    static FUNCTION_ID = "19dbdd4a-1203-48fd-b79a-c80356d6e82c";
    /** 功能名称 */
    static FUNCTION_NAME = "initialfantasy_func_privilege";
    /** 根文件名称 */
    static ROOT_FILE_NAME: string = "initialfantasy/index";
    /** 构造函数 */
    constructor() {
        super();
        this.id = PrivilegeFunc.FUNCTION_ID;
        this.name = PrivilegeFunc.FUNCTION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 默认功能 */
    default(): ibas.IApplication<ibas.IView> {
        let app: PrivilegeListApp = new PrivilegeListApp();
        app.navigation = this.navigation;
        return app;
    }
}
