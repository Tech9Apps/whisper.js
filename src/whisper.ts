import path from "path";
import {SpeechData, WhisperParams} from "./types";
import {getSpeechData} from "./speech";
import * as os from "os";
const { whisper: whisperNative } = require(path.join(
	__dirname,
	"../build/Release/whisper-addon"
));

const systemCpuCores = os.cpus();

const defaultParams = {
	n_threads: systemCpuCores?.length ?? 1,
	n_processors: systemCpuCores?.length ?? 1,
	offset_t_ms: 0,
	offset_n: 0,
	duration_ms: 0,
	max_context: 0,
	max_len: 0,
	best_of: 0,
	beam_size: 0,
	word_thold: 0,
	entropy_thold: 0,
	logprob_thold: 0,
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
		console.log(paramsWithDefaults)
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
