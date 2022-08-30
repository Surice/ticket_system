import chalk from 'chalk';

const clog = console.log;


export function success(content: string, action?: string): void {
	clog(chalk.bgGreen.bold.black(" [SUCCESS] ")+" "+  chalk.green((action) ? `at ${action}: ${content}` : content));
}
export function error(content: string, action?: string): void {
	clog(chalk.bgRed.bold.white(" [ERROR] ")+" "+  chalk.red((action) ? `at ${action}: ${content}` : content));
}
export function warn(content: string, action?: string): void {
	clog(chalk.bgHex('#FFFF00').bold.black(" [WARNING] ")+" "+  chalk.hex('#FFFF00').bold((action) ? `at ${action}: ${content}` : content));
}
export function info(content: string, action?: string): void {
	clog(chalk.blueBright((action) ? `at ${action}: ${content}` : content));
}