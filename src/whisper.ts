import path from "path";
import {SpeechData, WhisperParams} from "./types";
import {getSpeechData} from "./speech";
const { whisper: whisperNative } = require(path.join(
	__dirname,
	"../build/Release/whisper-addon"
));

const defaultParams = {
	n_threads: 0,
	n_processors: 0,
	offset_t_ms: 0,
	offset_n: 0,
	duration_ms: 0,
	max_context: -1,
	max_len: 0,
	best_of: 5,
	beam_size: -1,
	word_thold: 0.01,
	entropy_thold: 2.4,
	logprob_thold: -1.0,
	speed_up: false,
	translate: false,
	diarize: false,
	output_txt: false,
	output_vtt: false,
	output_srt: false,
	output_wts: false,
	output_csv: false,
	print_special: false,
	print_colors: false,
	print_progress: false,
	no_timestamps: false,
	fname_out: "",
	prompt: "",
}

export const whisper = (params: WhisperParams) => {
	return new Promise<Array<SpeechData> | null>((resolve, reject) => {
		const paramsWithDefaults = {
			...defaultParams,
			...params
		}
		try {
			whisperNative(paramsWithDefaults, (err: Error, result: Array<Array<string>>) => {
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
		} catch (e) {
			reject(e);
		}
	});
}
