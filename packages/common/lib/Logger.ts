import Pino from 'pino';
import StringUtils from './StringUtils';

declare var window: any;

let rootLogger: Logger;

const
    rootModuleName = 'in.obsrv.nexjs',
    rootModuleProps = {},
    rootLogLevel = 'debug',
    pinoOpts = {
        level: rootLogLevel,
        browser: {
            asObject: true,
            write: function(props: any) {
                const
                    levelLabelMap: any = {
                        10: 'TRACE',
                        20: 'DEBUG',
                        30: 'INFO',
                        40: 'WARN',
                        50: 'ERROR',
                        60: 'FATAL',
                    },
                    levelFuncMap: any = {
                        10: 'trace',
                        20: 'log',
                        30: 'info',
                        40: 'warn',
                        50: 'error',
                        60: 'error',
                    },
                    levelStyleMap: any = {
                        10: 'color: #ff63ec;',
                        20: 'color: #636263;',
                        30: 'color: #3b65da;',
                        40: 'color: #daa93b;',
                        50: 'color: #ff036c;',
                        60: 'color: #ffffff; background: #ff036c; font-weight: bold;'
                    },
                    resetStyle = 'color: inherit; background: inherit; font-weight: inherit;',
                    {name, level, time, msg, ...extraProps} = props,
                    consoleFuncName = levelFuncMap[level] ? levelFuncMap[level] : 'log',
                    levelLabel = levelLabelMap[level] ? levelLabelMap[level] : `#${level}`,
                    levelStyle = levelStyleMap[level] ? levelStyleMap[level] : resetStyle,
                    interpolatedMsg = StringUtils.interpolate(msg, extraProps),
                    formattedMsg = `%c[${levelLabel}:${name}]%c ${interpolatedMsg}`,
                    consoleFuncArgs = [formattedMsg, levelStyle, resetStyle];

                if (Object.keys(extraProps).length) {
                    consoleFuncArgs.push(extraProps);
                }

                window.console[consoleFuncName](...consoleFuncArgs);
            }
        }
    };


class Logger {
    private readonly upstreamLogger: Pino.Logger;
    private readonly moduleName: string;

    constructor(moduleName: string, extraProps = {}, upstreamLogger?: Pino.Logger) {
        this.moduleName = moduleName;

        if (!upstreamLogger) {
            upstreamLogger = Pino(Object.assign({}, pinoOpts, {
                base: rootModuleProps
            }));
        }

        this.upstreamLogger = upstreamLogger.child(Object.assign({
            name: this.moduleName
        }, extraProps));
    }

    forwardUpstream(methodName: string, msg: string, props: {}, ...interpolationValues: any[]) {
        this.upstreamLogger[methodName](props, msg, ...interpolationValues);
    }

    trace(args: any[])  { return (<any>this.forwardUpstream)('trace',...args); }
    debug(args: any[])  { return (<any>this.forwardUpstream)('debug',...args); }
    info(args: any[])   { return (<any>this.forwardUpstream)('info',...args); }
    warn(args: any[])   { return (<any>this.forwardUpstream)('warn',...args); }
    fatal(args: any[])  { return (<any>this.forwardUpstream)('fatal',...args); }

    getModule(childModuleName: string, extraProperties = {}) {
        return new Logger(
            `${this.moduleName}.${childModuleName}`,
            extraProperties,
            this.upstreamLogger
        );
    }
}

function getRoot() {
    if (!rootLogger) {
        rootLogger = new Logger(rootModuleName);
    }

    return rootLogger;
}

function getModule(moduleName: string, extraProperties = {}) {
    return getRoot().getModule(moduleName, extraProperties);
}

export {
    Logger,
    getRoot,
    getModule
};

export default getModule;