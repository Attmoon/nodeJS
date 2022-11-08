const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file'); // 로그파일 일자별로 생성
const appRoot = require('app-root-path'); // appRoot 경로를 가져오는 lib
const process = require('process');

const logDir = `${appRoot}/logs`; // logs 디렉토리 하위에 로그 파일 저장

const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});

const logger = winston.createLogger({
    format: combine(
        label({
            label: 'LogTestSystem'
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30, // 30일치 로그 파일 저장
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.error.log`,
            maxFiles: 30, // 30일치 로그 파일 저장
            zippedArchive: true,
        })
    ],
    exceptionHandlers: [ // uncaughtException 발생시
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30, // 30일치 로그 파일 저장
            zippedArchive: true,
        })
    ]
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            winston.format.simple(), // `${info.level}: $(info.message) JSON.stringify({...rest})` 포맷으로
        )
    }));
}

module.exports = logger;