export function makeUrl(forService, forName) {
    let url = properties.Services[forService].ssl ? "https://" : "http://"
                + properties.Services[forService].host
                + ":"
                + properties.Services[forService].port
                + properties.Services[forService].endPoints[forName].url;

    let onSuccess = properties.Services[forService].ssl ? "https://" : "http://"
                + properties.Services[forService].host
                + ":"
                + properties.Services[forService].port
                + properties.Services[forService].endPoints[forName].onSuccess;

    return {url, onSuccess};
}

export const properties = {
    Services: {
        Common: {
            host: "localhost",
            port: 8080,
            ssl: false,
            endPoints: {
                Authenticate: {
                    url: "/api/auth/signin",
                    onSuccess: "",
                },
                GetUsers: {
                    url: "/api/users/getallusers",
                    onSuccess: "",
                },
                GetCurrentUser: {
                    url: "/api/user/me",
                    onSuccess: "",
                },
                DeleteUser: {
                    url: "/api/users/deleteUser",
                    onSuccess: "",
                },
                UpdateUser: {
                    url: "/api/users/updateUser",
                    onSuccess: "",
                },
                GetRoles: {
                    url: "/api/users/getallroles",
                    onSuccess: "",
                },
                DeleteRole: {
                    url: "/api/users/deleteRole",
                    onSuccess: "",
                },
                AddRole: {
                    url: "/api/users/addRole",
                    onSuccess: "",
                },
                StatsData: {
                    url: "/api/v1/getStats",
                    onSuccess: "",
                },
            }
        },
        TypeCategoryService: {
            host: "localhost",
            port: 8081,
            ssl: false,
            endPoints: {
                QACheck: {
                    url: "/api/v1/runTypeCategoryQACheck",
                    onSuccess: "",
                },
                UpdateReferenceData: {
                    url: "/api/v1/updateReferenceData",
                    onSuccess: "/dashboard",
                },
                ImportReferenceData: {
                    url: "/api/v1/importReferenceData",
                    onSuccess: "/dashboard",
                },
                ReferenceData: {
                    url: "/api/v1/getLatestReferenceData",
                    onSuccess: "",
                },
                TypeCategoryMapping: {
                    url: "/api/v1/getTypeCategoryMapping",
                    onSuccess: "",
                },
                DeleteReferenceData: {
                    url: "/api/v1/deleteReferenceData",
                    onSuccess: "",
                },
                ImportModel: {
                    url: "/api/v1/importModel",
                    onSuccess: "",
                },
                GetModels: {
                    url: "/api/v1/getModels",
                    onSuccess: "",
                },
                ExportToOracle: {
                    url: "/api/v1/exportTCToOracle",
                    onSuccess: "/dashboard",
                },
                VersionInfo: {
                    url: "/api/v1/getAvailableVersions",
                    onSuccess: "",
                },
                ReferenceDataByVersion: {
                    url: "/api/v1/getReferenceData",
                    onSuccess: "",
                },
            }
        },
        ScheduleSetService: {
            host: "localhost",
            port: 8082,
            ssl: false,
            endPoints: {
                QACheck: {
                    url: "/api/v1/runScheduleSetQACheck",
                    onSuccess: "",
                },
                ScheduleSetData: {
                    url: "/api/v1/getLatestScheduleSetData",
                    onSuccess: "",
                },
                DeleteScheduleSetData: {
                    url: "/api/v1/deleteScheduleSet",
                    onSuccess: "/ScheduleSetData",
                },
                UpdateScheduleSetData: {
                    url: "/api/v1/updateScheduleSetData",
                    onSuccess: "/ScheduleSetData",
                },
                StatsData: {
                    url: "/api/v1/getStats",
                    onSuccess: "",
                },
                ExportToOracle: {
                    url: "/api/v1/exportSSToOracle",
                    onSuccess: "/dashboard",
                },
            }
        }
    },
    APIUrl: 'http://localhost:8080',
    APIAuthUrl: 'http://localhost:8080/api/auth/signin',
    APIEndPoints: {
        GetUsers: {
            endPoint: "api/users/getallusers",
            onSuccess: "",
        },
        GetCurrentUser: {
            endPoint: "api/user/me",
            onSuccess: "",
        },
        DeleteUser: {
            endPoint: "api/users/deleteUser",
            onSuccess: "",
        },
        UpdateUser: {
            endPoint: "api/users/updateUser",
            onSuccess: "",
        },
        GetRoles: {
            endPoint: "api/users/getallroles",
            onSuccess: "",
        },
        DeleteRole: {
            endPoint: "api/users/deleteRole",
            onSuccess: "",
        },
        AddRole: {
            endPoint: "api/users/addRole",
            onSuccess: "",
        },
        StatsData: {
            endPoint: "api/v1/getStats",
            onSuccess: "",
        },
        QACheck: {
            TypeCategory: {
                endPoint: "api/v1/runTypeCategoryQACheck",
                onSuccess: "",
            },
            ScheduleSet: {
                endPoint: "api/v1/runScheduleSetQACheck",
                onSuccess: "",
            },
        },
        UpdateReferenceData: {
            endPoint: "api/v1/updateReferenceData",
            onSuccess: "/dashboard",
        },
        ReferenceData: {
            endPoint: "api/v1/getLatestReferenceData",
            onSuccess: "",
        },
        TypeCategoryMapping: {
            endPoint: "api/v1/getTypeCategoryMapping",
            onSuccess: "",
        },
        DeleteReferenceData: {
            endPoint: "api/v1/deleteReferenceData",
            onSuccess: "",
        },
        ImportModel: {
            endPoint: "api/v1/importModel",
            onSuccess: "",
        },
        GetModels: {
            endPoint: "api/v1/getModels",
            onSuccess: "",
        },
        ScheduleSetData: {
            endPoint: "api/v1/getLatestScheduleSetData",
            onSuccess: "",
        },
        DeleteScheduleSetData: {
            endPoint: "api/v1/deleteScheduleSet",
            onSuccess: "/ScheduleSetData",
        },
        UpdateScheduleSetData: {
            endPoint: "api/v1/updateScheduleSetData",
            onSuccess: "/ScheduleSetData",
        },
        ExportToOracle: {
            TypeCategory: {
                endPoint: "api/v1/exportTCToOracle",
                onSuccess: "/dashboard",
            },
            ScheduleSet: {
                endPoint: "api/v1/exportSSToOracle",
                onSuccess: "/dashboard",
            }
        },
    },
    CSVExportQAErrors: {
        header: "RuleID,RuleDescription,SourceFileLineNumber,message,record\r\n",
    },
    ImportCSVScreen: {
        title: "Import Reference Data from CSV File",
        placeHolder: "Choose CSV File to Upload",
        filter: ".csv",
        loadButtonLabel: "Load",
        previewContentTitle: "Preview Data",
        qaErrorsContentTitle: "QA Errors",
        exportCSVButtonLabel: "Export",
        qaErrorRuleTitle: "QA Errors for Rule",
        borderColor: 'blue',
        borderSize: 4,
        importRecords: {
            newColor: 'success',
            newColumnColor: '#28a745',
            changedColumnColor: '#dc3545',
            changedColor: 'danger',
            newLabel: "New",
            changedLabel: "Changed",
        },
    },
    QAErrorsScreen: {
        //selectedRowColumnBackgroundColor: "#004d26",
    },
    ReferenceDataTableScreen: {
        //selectedRowColumnBackgroundColor: "#004d26",
        compareButtonLabel: "Compare",
        redirectTo: "/ReferenceData/ImportReferenceData",
        actions: {
            new: {
                label: "New",
                requiredInputPrompt: "Please enter the Type Category Identifier",
                requiredInputCancelPrompt: "Type Category Identifier is required to create a new Type Category",
            },
            deleteAll: {
                label: "Delete All",
                promptText: "Are you sure you wish to delete ALL reference data items?",
                disabled: "",
            },
            import: {
                label: "Import",
            },
            exportCSV: {
                label: "Export to CSV",
            },
            exportMatrix: {
                label: "Export to Matrix",
            },
            exportOracle: {
                label: "Export to Oracle",
            },
        },
        CSVExportReferenceData: {
            header: "TypeCategoryIdentifierText,TypeCategoryName,TypeCategoryDescription,SystemIdentifierText,RightSystemName,RightTypeCategoryName,DefaultTypeCode,TypeCode,TypeDescription,TypeName,RightTypeCode,TagName,TagValue\r\n",
        },
    },
    ScheduleSetDataTableScreen: {
        //selectedRowColumnBackgroundColor: "#004d26",
        compareButtonLabel: "Compare",
        redirectTo: "/ImportData",
        actions: {
            new: {
                label: "New",
                requiredInputPrompt: "Please enter the Type Category Identifier",
                requiredInputCancelPrompt: "Type Category Identifier is required to create a new Type Category",
            },
            deleteAll: {
                label: "Delete All",
                promptText: "Are you sure you wish to delete ALL reference data items?",
                disabled: "",
            },
            import: {
                label: "Import",
            },
            exportCSV: {
                label: "Export to CSV",
            },
            exportMatrix: {
                label: "Export to Matrix",
            },
            exportOracle: {
                label: "Export to Oracle",
            },
        },
        CSVExportReferenceData: {
            header: "ScheduleSetID, PurposeType, UnitOfMeasureType, ValueText, JurisdictionType, JurisdictionCode, JurisdictionName\r\n",
        },
    },
    validationRules: [
        { ScheduleSetID: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
        { ScheduleSetID: { validationType: 'number-only', validationRule: /^[0-9]+$/ } },
        { JurisdictionCode: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
        { TypeCategoryIdentifierText: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
        { TypeCategoryName: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
        { SystemIdentifierText: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
        { TypeCode: { validationType: 'required', validationRule: /^[0-9a-zA-Z]+$/ } },
    ]
};
