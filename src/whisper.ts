import path from "path";
import {SpeechData, WhisperParams} from "./types";
import {getSpeechData} from "./speech";
const { whisper: whisperNative } = require(path.join(
	__dirname,
	"../whisper.cpp/build/Release/whisper-addon"
));

export const whisper = (params: WhisperParams) => {
	return new Promise<Array<SpeechData> | null>((resolve, reject) => {
		whisperNative(params, (err: Error, result: Array<Array<string>>) => {
			if (err) {
				reject(err);
			} else {
				const filteredData = result?.reduce((acc: Array<SpeechData>, item) => {
					const speechData = getSpeechData(item);
					if (speechData !== null) {
						acc.push(speechData);
					}
					return acc;
				}, []) ?? [];
				resolve(filteredData);
			}
		});
	});
}
