/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { OrganizationListApp } from "./OrganizationListApp";

export class OrganizationFunc extends ibas.ModuleFunction {

    /** 功能标识 */
    static FUNCTION_ID = "af395294-f0e0-4958-b620-fda383586e76";
    /** 功能名称 */
    static FUNCTION_NAME = "initialfantasy_func_organization";
    /** 根文件名称 */
    static ROOT_FILE_NAME: string = "initialfantasy/index";
    /** 构造函数 */
    constructor() {
        super();
        this.id = OrganizationFunc.FUNCTION_ID;
        this.name = OrganizationFunc.FUNCTION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 默认功能 */
    default(): ibas.IApplication<ibas.IView> {
        let app: OrganizationListApp = new OrganizationListApp();
        app.navigation = this.navigation;
        return app;
    }
}
