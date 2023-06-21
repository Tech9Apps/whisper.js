# Whisper.js

<img src="logo.png" width="500" height="144" alt="whisper.js" />

[![npm version](https://badge.fury.io/js/%40tech9app%2Fwhisper.js.svg)](https://badge.fury.io/js/%40tech9app%2Fwhisper.js)

The Whisper library provides a convenient way to transcribe or translate audio files using Node.js. It utilizes the [Whisper C++](https://github.com/ggerganov/whisper.cpp) library under the hood to perform the audio processing tasks.
This library uses native Node.js addons to interface with the Whisper C++ library. It is compatible with Node.js versions 14 and above.

## Pre-requisites

- **C++ Compiler**: You will need a compatible C++ compiler installed on your system. Ensure that you have a C++ compiler installed. Refer to the documentation of your operating system or compiler for installation instructions.

- **CMake**: CMake is required for building the whisper.cpp library. Make sure you have CMake installed on your system. You can download CMake from the official website: https://cmake.org

## Installation

To use the Whisper library, follow these steps:

1. Ensure you have Node.js installed on your machine. You can download it from the official Node.js website: [https://nodejs.org](https://nodejs.org)

2. Open your terminal or command prompt.

3. Navigate to your project directory.

4. Run the following command to install the Whisper library:

```shell
npm install @tech9app/whisper.js
```

## Usage

To transcribe or translate an audio file using the Whisper library, follow these steps:

1. Import the necessary types and the whisper function from the Whisper library:
    ```typescript
    import { WhisperParams, SpeechData, whisper } from '@tech9app/whisper.js';
    ```

2. Define the parameters for the Whisper process by creating an instance of WhisperParams. This object contains various options and settings for the transcription or translation process. For example:
    ```typescript
    const whisperParams: WhisperParams = {
      language: 'en',
      model: '/path/to/models',
      fname_inp: '/path/to/input/file.wav',
      output_txt: true,
    };
    ```

3. Call the whisper function, passing the whisperParams as an argument. The whisper function returns a promise that resolves to an array of SpeechData objects or null if the process fails. For example:
    ```typescript
    const speechData: SpeechData[] | null = await whisper(whisperParams);
    ```

4. Handle the result of the whisper process as needed. The result is an array of SpeechData objects, where each object represents a segment of speech. Each SpeechData object contains the start and end timestamps and the corresponding speech content.

> Note: Make sure to handle any potential errors or exceptions during the process.

## API Reference
### Type Definitions
#### WhisperParams
An interface representing the parameters for the Whisper process. It includes the following properties:

| Parameter          | Description                                                 | Default Value     |
|--------------------|-------------------------------------------------------------|-------------------|
| n_threads          | The number of threads to use for processing                  | System-dependent |
| n_processors       | The number of processors to use for processing               | 1                 |
| offset_t_ms        | The offset time in milliseconds                             | 0                 |
| offset_n           | The offset value                                            | 0                 |
| duration_ms        | The duration in milliseconds                                | 0                 |
| max_context        | The maximum context value                                    | -1                |
| max_len            | The maximum length                                          | 0                 |
| best_of            | The best of value                                           | 5                 |
| beam_size          | The beam size                                               | -1                |
| word_thold         | The word threshold                                          | 0.01              |
| entropy_thold      | The entropy threshold                                       | 2.4               |
| logprob_thold      | The log probability threshold                               | -1.0              |
| speed_up           | Whether to enable speed-up optimization                     | false             |
| translate          | Whether to enable translation                               | false             |
| diarize            | Whether to enable diarization                               | false             |
| output_txt         | Whether to output as text                                   | false             |
| output_vtt         | Whether to output as VTT                                    | false             |
| output_srt         | Whether to output as SRT                                    | false             |
| output_wts         | Whether to output as WTS                                    | false             |
| output_csv         | Whether to output as CSV                                    | false             |
| print_special      | Whether to print special characters                         | false             |
| print_colors       | Whether to print with colors                                | false             |
| print_progress     | Whether to print progress information                       | false             |
| no_timestamps      | Whether to exclude timestamps                              | false             |
| language           | The language to use for processing                          | undefined         |
| prompt             | The initial prompt                                         | undefined         |
| model (required)   | The path to the model file                                  | -                 |
| fname_inp (required)| The path to the input audio file                            | -                 |
| fname_out          | The path to the output file                                 | -                 |

#### SpeechData

A type representing the speech data of a segment. It includes the following properties:

| Field    | Description                      |
|----------|----------------------------------|
| start    | The start timestamp of the segment |
| end      | The end timestamp of the segment   |
| speech   | The speech content of the segment  |

### Functions
#### Whisper
The main function of the Whisper library. It processes audio based on the provided parameters and returns a promise that resolves to an array of SpeechData objects or null.

```typescript
whisper(params: WhisperParams): Promise<Array<SpeechData> | null>
```

## Examples
Here's an example usage of the Whisper library:

```typescript
import { WhisperParams, SpeechData, whisper } from '@tech9app/whisper.js';

const whisperParams: WhisperParams = {
  language: 'en',
  model: '/path/to/models',
  fname_inp: '/path/to/input/file.wav',
  output_txt: true,
};

whisper(whisperParams).then((result: Array<SpeechData> | null) => {
  console.log('Result from whisper:', result);
});
```

In this example, the whisperParams object specifies the parameters for the Whisper process, such as the language, model path, input file path, and output format. The whisper function is called with these parameters, and the resulting promise is handled to obtain the transcribed speech segments.

## Download Models

### Whisper.js Download Utility
This utility allows you to download a model using Whisper.js.

#### Usage
The Whisper.js Download Utility supports the following options:

- `-m, --modelName <modelName>`: Specify the model name.
- `-p, --storagePath <storagePath>`: Specify the storage path.
- `-h, --help`: Display help for the command.

To use the Whisper.js Download Utility, make sure you have Node.js installed on your system. Then, open your terminal and run the following command:
    
```shell
npx @tech9app/whisper.js download -m <modelName> -p <storagePath>
```

Replace `<modelName>` with the desired model name and `<storagePath>` with the desired storage path.


#### List of Models

| Model     | Disk   | RAM     |
|-----------|--------|---------|
| tiny      |  75 MB | ~390 MB |
| tiny.en   |  75 MB | ~390 MB |
| base      | 142 MB | ~500 MB |
| base.en   | 142 MB | ~500 MB |
| small     | 466 MB | ~1.0 GB |
| small.en  | 466 MB | ~1.0 GB |
| medium    | 1.5 GB | ~2.6 GB |
| medium.en | 1.5 GB | ~2.6 GB |
| large-v1  | 2.9 GB | ~4.7 GB |
| large     | 2.9 GB | ~4.7 GB |


#### Examples
Download the "base.en" model and store it in the "models" directory:
    
```shell
npx @tech9app/whisper.js download -m base.en -p models
```


## License
This library is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

