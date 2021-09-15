
class ConsoleLogger {
	constructor() {
		const buildType = process.env.BUILD_TYPE;
		this.log = buildType === 'production' ? () => { } : console.log;
		this.error = buildType === 'production' ? () => { } : console.error;
		this.info = buildType === 'production' ? () => { } : console.log;
	}

	log(msg: any) {
		this.log(msg);
	}

	info(msg: any) {
		this.info(msg);
	}

	error(msg: any) {
		this.error(msg);
	}
}

export const logger = new ConsoleLogger();
