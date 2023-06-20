import { whisper, WhisperParams } from "../index";

const whisperParams: WhisperParams = {
	language: 'en',
	model: '/path/to/models',
	fname_inp: '/path/to/input/file.wav',
	output_txt: true,
};

// @ts-ignore
whisper(whisperParams).then((result) => {
	console.log(`Result from whisper:` , result);
});