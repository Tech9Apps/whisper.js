import exp from "constants";

export interface WhisperParams {
	n_threads?: number;
	n_processors?: number;
	offset_t_ms?: number;
	offset_n?: number;
	duration_ms?: number;
	max_context?: number;
	max_len?: number;
	best_of?: number;
	beam_size?: number;
	word_thold?: number;
	entropy_thold?: number;
	logprob_thold?: number;
	speed_up?: boolean;
	translate?: boolean;
	diarize?: boolean;
	output_txt?: boolean;
	output_vtt?: boolean;
	output_srt?: boolean;
	output_wts?: boolean;
	output_csv?: boolean;
	print_special?: boolean;
	print_colors?: boolean;
	print_progress?: boolean;
	no_timestamps?: boolean;
	language?: string;
	prompt?: string;
	model: string;
	fname_inp: string;
	fname_out?: string;
}

export type SpeechData = {
	start: string;
	end: string;
	speech: string;
};

export type Whisper = (params: WhisperParams) => Promise<Array<SpeechData> | null>;





