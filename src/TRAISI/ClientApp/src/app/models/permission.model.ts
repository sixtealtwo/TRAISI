// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

export type PermissionNames =
    "View Users" | "Manage Users" | "View Group Users" |
    "Manage Group Users" | "View Roles" | "Manage Roles" | 
    "Assign Roles" | "View Surveys";

export type PermissionValues =
    "users.view" | "users.manage" | "users.viewgroup" |
    "users.managegroup" | "roles.view" | "roles.manage" | 
    "roles.assign" | "surveys.view";

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues = "users.manage";
    public static readonly viewGroupUsersPermission: PermissionValues = "users.viewgroup";
    public static readonly manageGroupUsersPermission: PermissionValues = "users.managegroup";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    public static readonly manageRolesPermission: PermissionValues = "roles.manage";
    public static readonly assignRolesPermission: PermissionValues = "roles.assign";

    public static readonly viewSurveysPermission: PermissionValues = "surveys.view";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}
