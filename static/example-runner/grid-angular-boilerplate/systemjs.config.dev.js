(function (global) {
    var ANGULAR_VERSION = "14.2.6";
    var ANGULAR_CDK_VERSION = "14.2.6";
    var ANGULAR_MATERIAL_VERSION = "14.2.6";

    System.config({
        // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
        transpiler: "ts",
        typescriptOptions: {
            // Copy of compiler options in standard tsconfig.json
            target: "es2015",
            module: "system", //gets rid of console warning
            moduleResolution: "node",
            sourceMap: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            lib: ["es2015", "dom"],
            noImplicitAny: true,
            suppressImplicitAnyIndexErrors: true
        },
        meta: {
            typescript: {
                exports: "ts"
            },
            '*.css': { loader: 'css' }
        },
        paths: {
            // paths serve as alias
            "npm:": "https://cdn.jsdelivr.net/npm/"
        },
        // RxJS makes a lot of requests to jsdelivr. This guy addressed it:
        // https://github.com/OasisDigital/rxjs-system-bundle.
        bundles: {
            "npm:rxjs-system-bundle@6.3.3/Rx.system.min.js": [
                "rxjs",
                "rxjs/*",
                "rxjs/operator/*",
                "rxjs/operators/*",
                "rxjs/observable/*",
                "rxjs/scheduler/*",
                "rxjs/symbol/*",
                "rxjs/add/operator/*",
                "rxjs/add/observable/*",
                "rxjs/util/*"
            ]
        },
        // map tells the System loader where to look for things
        map:
        {
            // Angular bundles in System.register format via esm-bundle
            // Cell renderers only work with the esm-bundle version
            // TemplateUrls only works with platform-browser-dynamic from esm-bundle
            '@angular/compiler': 'npm:@esm-bundle/angular__compiler@' + ANGULAR_VERSION + '/system/es2015/ivy/angular-compiler.min.js',
            '@angular/platform-browser-dynamic': 'npm:@esm-bundle/angular__platform-browser-dynamic@' + ANGULAR_VERSION + '/system/es2015/ivy/angular-platform-browser-dynamic.min.js',

            '@angular/core': 'npm:@angular/core@' + ANGULAR_VERSION + '/fesm2015/core.mjs',
            '@angular/common': 'npm:@angular/common@' + ANGULAR_VERSION + '/fesm2015/common.mjs',
            '@angular/common/http': 'npm:@angular/common@' + ANGULAR_VERSION + '/fesm2015/http.mjs',

            '@angular/platform-browser': 'npm:@angular/platform-browser@' + ANGULAR_VERSION + '/fesm2015/platform-browser.mjs',
            '@angular/platform-browser/animations': 'npm:@angular/platform-browser@' + ANGULAR_VERSION + '/fesm2015/animations.mjs',

            '@angular/forms': 'npm:@angular/forms@' + ANGULAR_VERSION + '/fesm2015/forms.mjs',
            '@angular/router': 'npm:@angular/router@' + ANGULAR_VERSION + '/fesm2015/router.mjs',
            '@angular/animations': 'npm:@angular/animations@' + ANGULAR_VERSION + '/fesm2015/animations.mjs',
            '@angular/animations/browser': 'npm:@angular/animations@' + ANGULAR_VERSION + '/fesm2015/browser.mjs',

            // material design
            "@angular/material/core": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/core.mjs",
            "@angular/material/card": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/card.mjs",
            "@angular/material/radio": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/radio.mjs",
            "@angular/material/slider": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/slider.mjs",
            "@angular/material/select": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/select.mjs",
            "@angular/material/progress-spinner": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/progress-spinner.mjs",
            "@angular/material/input": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/input.mjs",
            "@angular/material/icon": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/icon.mjs",
            "@angular/material/form-field": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/form-field.mjs",
            "@angular/material/checkbox": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/checkbox.mjs",
            "@angular/material/button-toggle": "npm:@angular/material@" + ANGULAR_MATERIAL_VERSION + "/fesm2015/button-toggle.mjs",

            "@angular/cdk": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/cdk.mjs",
            "@angular/cdk/platform": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/platform.mjs",
            "@angular/cdk/layout": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/layout.mjs",
            "@angular/cdk/bidi": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/bidi.mjs",
            "@angular/cdk/coercion": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/coercion.mjs",
            "@angular/cdk/keycodes": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/keycodes.mjs",
            "@angular/cdk/a11y": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/a11y.mjs",
            "@angular/cdk/overlay": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/overlay.mjs",
            "@angular/cdk/portal": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/portal.mjs",
            "@angular/cdk/observers": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/observers.mjs",
            "@angular/cdk/collections": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/collections.mjs",
            "@angular/cdk/scrolling": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/scrolling.mjs",
            "@angular/cdk/text-field": "npm:@angular/cdk@" + ANGULAR_CDK_VERSION + "/fesm2015/text-field.mjs",

            css: boilerplatePath + "css.js",
            ts: "npm:plugin-typescript@8.0.0/lib/plugin.js",
            tslib: "npm:tslib@2.3.1/tslib.js",
            typescript: "npm:typescript@4.3.5/lib/typescript.min.js",

            // our app is within the app folder, appLocation comes from index.html
            app: appLocation + "app",
            ...systemJsMap
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: "./main.ts",
                defaultExtension: "ts",
                meta: {
                    "*.ts": {
                        loader: boilerplatePath + "systemjs-angular-loader.js"
                    }
                }
            },
            'ag-grid-angular': {
                main: './dist/ag-grid-angular/fesm2015/ag-grid-angular.js',
                defaultExtension: 'js'
            },
            'ag-grid-community': {
                main: './dist/ag-grid-community.cjs.js',
                defaultExtension: 'js'
            },
            'ag-grid-enterprise': {
                main: './dist/ag-grid-enterprise.cjs.js',
                defaultExtension: 'js'
            },
            "@ag-grid-community/angular": {
                main: "./dist/ag-grid-angular/fesm2015/ag-grid-community-angular.js",
                defaultExtension: "js"
            },
            // these are a little different in that they're in a directory and sjs doesn't default to the index.js inside...
            '@ag-grid-community/core/dist/cjs/es5/utils': {
                main: './index.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/charts/dist/cjs/es5/charts/chartComp/menu/settings/miniCharts': {
                main: './index.js',
                defaultExtension: 'js'
            },
            /* START OF MODULES - DO NOT DELETE */
            '@ag-grid-community/all-modules': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-community/client-side-row-model': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-community/core': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-community/csv-export': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-community/infinite-row-model': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            'ag-charts-community': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js',
                format: 'cjs'
            },
            '@ag-grid-enterprise/all-modules': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/charts': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/clipboard': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/column-tool-panel': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/core': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/excel-export': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/filter-tool-panel': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/master-detail': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/menu': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/multi-filter': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/range-selection': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/rich-select': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/row-grouping': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/server-side-row-model': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/set-filter': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/side-bar': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/sparklines': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/status-bar': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            '@ag-grid-enterprise/viewport-row-model': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            'ag-charts-enterprise': {
                main: './dist/cjs/es5/main.js',
                defaultExtension: 'js'
            },
            /* END OF MODULES - DO NOT DELETE */
            rxjs: {
                defaultExtension: false
            }
        }
    });
})(this);

