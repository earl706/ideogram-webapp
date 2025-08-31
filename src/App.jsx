// import React, { useState, useRef } from 'react';

// const SpeechApp = () => {
// 	const [entries, setEntries] = useState([
// 		'Land',
// 		'Water',
// 		'Biological/Organic',
// 		'Manmade',
// 		'Space/Air',
// 		'Natural',
// 		'Natural',
// 		'Motion Energy',
// 		'Animal',
// 		'Human',
// 		'Male',
// 		'Female'
// 	]);
// 	const [input, setInput] = useState('');
// 	const [isSpeaking, setIsSpeaking] = useState(false);
// 	const [speed, setSpeed] = useState('medium');
// 	const [currentIndex, setCurrentIndex] = useState(null);
// 	const [flashIndex, setFlashIndex] = useState(null);
// 	const [durationMinutes, setDurationMinutes] = useState(2); // min 2 minutes

// 	const stopSpeakingRef = useRef(null);

// 	const speedIntervals = {
// 		'very slow': 5000,
// 		slow: 3000,
// 		medium: 2000,
// 		fast: 1000,
// 		'very fast': 500
// 	};

// 	// wait for voices to load properly
// 	function getVoice() {
// 		return new Promise((resolve) => {
// 			let voices = speechSynthesis.getVoices();
// 			if (voices.length) {
// 				resolve(voices[0]);
// 			} else {
// 				speechSynthesis.onvoiceschanged = () => {
// 					resolve(speechSynthesis.getVoices()[0]);
// 				};
// 			}
// 		});
// 	}

// 	const addEntry = () => {
// 		if (input.trim() !== '') {
// 			setEntries([...entries, input.trim()]);
// 			setInput('');
// 		}
// 	};

// 	const deleteEntry = (index) => {
// 		setEntries(entries.filter((_, i) => i !== index));
// 		if (currentIndex === index) setCurrentIndex(null);
// 	};

// 	const startSpeaking = async () => {
// 		if (entries.length === 0) return;

// 		const voice = await getVoice();
// 		setIsSpeaking(true);
// 		let keepSpeaking = true;

// 		const durationMs = durationMinutes * 60 * 1000; // minutes → ms

// 		const speakNext = () => {
// 			if (!keepSpeaking) return;

// 			const idx = Math.floor(Math.random() * entries.length);
// 			setCurrentIndex(idx);
// 			setFlashIndex(idx);
// 			setTimeout(() => setFlashIndex(null), 500);

// 			const utterance = new SpeechSynthesisUtterance(entries[idx]);
// 			utterance.voice = voice;

// 			// stop the utterance after duration
// 			const timer = setTimeout(() => {
// 				window.speechSynthesis.cancel();
// 				if (keepSpeaking) speakNext();
// 			}, durationMs);

// 			utterance.onend = () => {
// 				clearTimeout(timer);
// 				if (keepSpeaking) {
// 					setTimeout(speakNext, speedIntervals[speed]);
// 				}
// 			};

// 			window.speechSynthesis.speak(utterance);
// 		};

// 		speakNext();

// 		stopSpeakingRef.current = () => {
// 			keepSpeaking = false;
// 			window.speechSynthesis.cancel();
// 			setIsSpeaking(false);
// 			setCurrentIndex(null);
// 		};
// 	};

// 	const stopSpeaking = () => {
// 		if (stopSpeakingRef.current) stopSpeakingRef.current();
// 	};

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
// 			<div className="w-full rounded-2xl bg-white shadow-lg">
// 				<div className="space-y-4 p-6">
// 					<h1 className="text-center text-2xl font-bold">Ideogram</h1>

// 					<form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
// 						<input
// 							type="text"
// 							value={input}
// 							onChange={(e) => setInput(e.target.value)}
// 							placeholder="Enter text"
// 							className="flex-1 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// 						/>
// 						<button
// 							onClick={addEntry}
// 							className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-700 active:scale-[.98]"
// 						>
// 							Add
// 						</button>
// 					</form>

// 					<ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
// 						{entries.map((entry, idx) => (
// 							<li
// 								key={idx}
// 								className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-all duration-500 ${
// 									currentIndex === idx ? 'border-blue-400 font-semibold' : 'border-transparent'
// 								} ${flashIndex === idx ? 'bg-yellow-300' : 'bg-gray-100'}`}
// 							>
// 								<span className="truncate pr-3">{entry}</span>
// 								<button
// 									onClick={() => deleteEntry(idx)}
// 									className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-white transition-all duration-200 hover:bg-red-700"
// 								>
// 									Delete
// 								</button>
// 							</li>
// 						))}
// 					</ul>

// 					{currentIndex !== null && (
// 						<div
// 							className="animate-pulse text-center text-2xl font-semibold text-blue-700"
// 							aria-live="polite"
// 						>
// 							{entries[currentIndex]}
// 						</div>
// 					)}

// 					{/* Speed control */}
// 					<div className="flex items-center gap-2">
// 						<label className="font-medium">Speed:</label>
// 						<select
// 							value={speed}
// 							onChange={(e) => setSpeed(e.target.value)}
// 							className="rounded-xl border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// 						>
// 							<option value="very slow">Very Slow</option>
// 							<option value="slow">Slow</option>
// 							<option value="medium">Medium</option>
// 							<option value="fast">Fast</option>
// 							<option value="very fast">Very Fast</option>
// 						</select>
// 					</div>

// 					{/* Duration control */}
// 					<div className="flex items-center gap-2">
// 						<label className="font-medium">Duration (minutes):</label>
// 						<input
// 							type="number"
// 							min="2"
// 							value={durationMinutes}
// 							onChange={(e) => setDurationMinutes(Math.max(2, parseInt(e.target.value) || 2))}
// 							className="w-20 rounded-xl border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// 						/>
// 					</div>

// 					{/* Start/Stop */}
// 					<div className="flex justify-center gap-2">
// 						{!isSpeaking ? (
// 							<button
// 								onClick={startSpeaking}
// 								className="cursor-pointer rounded-xl bg-green-600 px-5 py-2 text-white transition-all duration-200 hover:bg-green-700"
// 							>
// 								Start
// 							</button>
// 						) : (
// 							<button
// 								onClick={stopSpeaking}
// 								className="cursor-pointer rounded-xl bg-gray-700 px-5 py-2 text-white transition-all duration-200 hover:bg-gray-800"
// 							>
// 								Stop
// 							</button>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// function App() {
// 	return <SpeechApp />;
// }

// export default App;

import React, { useState, useEffect, useRef } from 'react';

export default function App() {
	const initialEntries = [
		'Land',
		'Water',
		'Biological/Organic',
		'Manmade',
		'Space/Air',
		'Natural',
		'Motion Energy',
		'Animal',
		'Human',
		'Male',
		'Female'
	];

	const [entries, setEntries] = useState(initialEntries);
	const [currentEntry, setCurrentEntry] = useState('');
	const [speed, setSpeed] = useState('medium');
	const [isRunning, setIsRunning] = useState(false);
	const [duration, setDuration] = useState(120); // default 2 min
	const [timeLeft, setTimeLeft] = useState(duration);

	const intervalRef = useRef(null);
	const countdownRef = useRef(null);

	const speedMap = {
		'very slow': 4000,
		slow: 3000,
		medium: 2000,
		fast: 1000,
		'very fast': 500
	};

	const speak = (text) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'en-US';
			window.speechSynthesis.cancel(); // cancel ongoing speech
			window.speechSynthesis.speak(utterance);
		}
	};

	const startDictation = () => {
		setIsRunning(true);
		setTimeLeft(duration);

		intervalRef.current = setInterval(() => {
			const randomEntry = entries[Math.floor(Math.random() * entries.length)];
			setCurrentEntry(randomEntry);
			speak(randomEntry);
		}, speedMap[speed]);

		countdownRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					stopDictation();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const stopDictation = () => {
		setIsRunning(false);
		setCurrentEntry('');
		clearInterval(intervalRef.current);
		clearInterval(countdownRef.current);
		window.speechSynthesis.cancel();
	};

	useEffect(() => {
		return () => {
			clearInterval(intervalRef.current);
			clearInterval(countdownRef.current);
		};
	}, []);

	// Format countdown as MM:SS
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const handleDeleteEntry = (entry) => {
		setEntries(entries.filter((e) => e !== entry));
	};
	const handleAddEntry = (e) => {
		e.preventDefault();
		const form = e.target;
		const input = form.elements.entry;
		const newEntry = input.value.trim();
		if (newEntry && !entries.includes(newEntry)) {
			setEntries([...entries, newEntry]);
		}
		input.value = '';
	};

	// Circle progress calculation
	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const progress = timeLeft > 0 ? (timeLeft / duration) * circumference : 0;

	return (
		<div className="mx-xl flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
			<h1 className="mb-6 text-3xl font-bold text-gray-800">Ideogram</h1>
			<form onSubmit={handleAddEntry} className="mb-4 flex w-full gap-2">
				<input
					type="text"
					name="entry"
					placeholder="New entry"
					className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring focus:outline-none"
				/>
				<button
					type="submit"
					className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
				>
					Add
				</button>
			</form>

			{/* Entries List */}
			<div className="mb-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
				{entries.map((entry, idx) => (
					<div
						key={idx}
						className={`flex items-center justify-between rounded-xl px-4 py-2 text-center shadow transition-all ${
							currentEntry === entry
								? 'scale-105 bg-blue-500 font-bold text-white'
								: 'bg-white text-gray-700'
						}`}
					>
						<span className="font-medium">{entry}</span>
						<button
							onClick={() => handleDeleteEntry(entry)}
							className="cursor-pointer rounded-[5px] bg-red-500 px-2 py-1 text-white hover:bg-red-700"
						>
							Delete
						</button>
					</div>
				))}
			</div>

			{/* Control Panel */}
			<div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-lg">
				{/* Speed Selector */}
				<div className="flex w-full flex-col">
					<label className="mb-1 text-sm text-gray-600">Speed</label>
					<select
						value={speed}
						onChange={(e) => setSpeed(e.target.value)}
						className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
					>
						{Object.keys(speedMap).map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				{/* Duration Selector */}
				<div className="flex w-full flex-col">
					<label className="mb-1 text-sm text-gray-600">Duration (seconds, min 120)</label>
					<input
						type="number"
						min="120"
						value={duration}
						onChange={(e) => setDuration(Number(e.target.value))}
						className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
					/>
				</div>

				{/* Countdown + Circular Timer */}
				{isRunning && (
					<div className="flex flex-col items-center gap-3">
						<div className="relative h-24 w-24">
							<svg className="h-full w-full -rotate-90 transform">
								<circle
									cx="50%"
									cy="50%"
									r={radius}
									stroke="currentColor"
									strokeWidth="8"
									className="text-gray-300"
									fill="transparent"
								/>
								<circle
									cx="50%"
									cy="50%"
									r={radius}
									stroke="currentColor"
									strokeWidth="8"
									className="text-blue-500 transition-all duration-1000 ease-linear"
									fill="transparent"
									strokeDasharray={circumference}
									strokeDashoffset={circumference - progress}
									strokeLinecap="round"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
								{formatTime(timeLeft)}
							</div>
						</div>
					</div>
				)}

				{/* Start / Stop Buttons */}
				<div className="flex gap-4">
					{!isRunning ? (
						<button
							onClick={startDictation}
							className="cursor-pointer rounded-xl bg-blue-500 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-600"
						>
							Start
						</button>
					) : (
						<button
							onClick={stopDictation}
							className="cursor-pointer rounded-xl bg-red-500 px-6 py-2 font-semibold text-white shadow transition hover:bg-red-600"
						>
							Stop
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
