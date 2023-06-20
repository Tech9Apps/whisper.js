import {SpeechData} from "./types";

export const getSpeechData = (time: Array<string>): SpeechData | null => {
	if (!time || !Array.isArray(time) || time.length !== 3) {
		return null;
	}
	
	const [startTime, endTime, speech] = time.map((part: string, index: number) => {
		if (index === 0 || index === 1) {
			return convertTimeFormat(part);
		}
		return part;
	});
	
	return {
		start: startTime,
		end: endTime,
		speech
	};
};
const convertTimeFormat = (time: string): string => time.replace(/,(?=[^,]*$)/, '.');
