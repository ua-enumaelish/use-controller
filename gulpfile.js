
let gulp = require('gulp');

/*-------------------------------------------------
    Inject configuration of ENVIRONMENT in source code of project
    package environment dependencies
    "gulp-token-replace": "^1.0.3",
    "gulp-rename": "^1.2.2",

     * rewrite config file
     * from template
---------------------------------------------------*/
gulp.task('env-node', () => environment(process.env.REACT_APP_ENV || 'development'));

/**
 * Prepare app configuration based on environment variable
 *
 * @param {String} [env]
 */
function environment ( env ) {
    let config = { /* default properties */ };
    let gRename = require('gulp-rename');
    let gTokenReplace = require('gulp-token-replace');
    // store env path
    env&&(environment.current = env+'.json');
    // clear cash before require a json file
    let regCache = new RegExp(environment.current);
    for (let name in require.cache) {
        if (regCache.test(name)) {
            delete require.cache[name];
            break;
        }
    }
    // path to environment file
    let envPath = './environment/'+environment.current;
    // merge gulp configs with environment
    Object.assign(config, {
        // calculated part
        timestamp: (new Date()).valueOf(),
        version: require('./package.json').version,
        // environment config
    }, require(envPath));
    // beautify
    let beautifulConfig = JSON.stringify(config, null, 4);
    console.log('\nENVIRONMENT from => ', envPath,'\n', beautifulConfig,'\n');
    // action
    return gulp
        .src('./environment/config.template.js')
        .pipe(gTokenReplace({ global: { 'config': beautifulConfig } }))
        .pipe(gRename(path => path.basename = 'app-config'))
        .pipe(gulp.dest('./src/constants'));
}
