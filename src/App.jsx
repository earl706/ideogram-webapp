import React, { useState, useEffect, useRef } from 'react';

const SpeechApp = () => {
	const [entries, setEntries] = useState([
		'Land',
		'Water',
		'Biological/Organic',
		'Manmade',
		'Space/Air',
		'Natural',
		'Natural',
		'Motion Energy',
		'Animal',
		'Human',
		'Male',
		'Female'
	]);
	const [input, setInput] = useState('');
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [speed, setSpeed] = useState('medium');
	const [currentIndex, setCurrentIndex] = useState(null);
	const [flashIndex, setFlashIndex] = useState(null);

	const intervalRef = useRef(null);

	const speedIntervals = {
		'very slow': 5000,
		slow: 3000,
		medium: 2000,
		fast: 1000,
		'very fast': 500
	};

	const addEntry = () => {
		if (input.trim() !== '') {
			setEntries([...entries, input.trim()]);
			setInput('');
		}
	};

	const deleteEntry = (index) => {
		setEntries(entries.filter((_, i) => i !== index));
		if (currentIndex === index) setCurrentIndex(null);
	};

	const speakRandom = () => {
		if (entries.length === 0) return;
		const idx = Math.floor(Math.random() * entries.length);
		setCurrentIndex(idx);
		setFlashIndex(idx);
		setTimeout(() => setFlashIndex(null), 500); // remove flash after 0.5s
		const utterance = new SpeechSynthesisUtterance(entries[idx]);
		window.speechSynthesis.speak(utterance);
	};

	const startSpeaking = () => {
		if (isSpeaking || entries.length === 0) return;
		setIsSpeaking(true);
		intervalRef.current = setInterval(speakRandom, speedIntervals[speed]);
	};

	const stopSpeaking = () => {
		setIsSpeaking(false);
		setCurrentIndex(null);
		clearInterval(intervalRef.current);
		window.speechSynthesis.cancel();
	};

	// If speed changes while speaking, restart the timer with the new interval
	useEffect(() => {
		if (!isSpeaking) return;
		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(speakRandom, speedIntervals[speed]);
		return () => clearInterval(intervalRef.current);
	}, [speed, isSpeaking]);

	useEffect(() => {
		return () => clearInterval(intervalRef.current);
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
			<div className="w-full rounded-2xl bg-white shadow-lg">
				<div className="space-y-4 p-6">
					<h1 className="text-center text-2xl font-bold">Ideogram</h1>

					<div className="flex gap-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Enter text"
							className="flex-1 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							onClick={addEntry}
							className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-700 active:scale-[.98]"
						>
							Add
						</button>
					</div>

					<ul className="grid grid-cols-2 gap-5">
						{entries.map((entry, idx) => (
							<li
								key={idx}
								className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-all duration-500 ${
									currentIndex === idx ? 'border-blue-400 font-semibold' : 'border-transparent'
								} ${flashIndex === idx ? 'bg-yellow-300' : 'bg-gray-100'}`}
							>
								<span className="truncate pr-3">{entry}</span>
								<button
									onClick={() => deleteEntry(idx)}
									className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-white transition-all duration-200 hover:bg-red-700"
								>
									Delete
								</button>
							</li>
						))}
					</ul>

					{currentIndex !== null && (
						<div
							className="animate-pulse text-center text-2xl font-semibold text-blue-700"
							aria-live="polite"
						>
							{entries[currentIndex]}
						</div>
					)}

					<div className="flex items-center gap-2">
						<label className="font-medium">Speed:</label>
						<select
							value={speed}
							onChange={(e) => setSpeed(e.target.value)}
							className="rounded-xl border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="very slow">Very Slow</option>
							<option value="slow">Slow</option>
							<option value="medium">Medium</option>
							<option value="fast">Fast</option>
							<option value="very fast">Very Fast</option>
						</select>
					</div>

					<div className="flex justify-center gap-2">
						{!isSpeaking ? (
							<button
								onClick={startSpeaking}
								className="cursor-pointer rounded-xl bg-green-600 px-5 py-2 text-white transition-all duration-200 hover:bg-green-700"
							>
								Start
							</button>
						) : (
							<button
								onClick={stopSpeaking}
								className="cursor-pointer rounded-xl bg-gray-700 px-5 py-2 text-white transition-all duration-200 hover:bg-gray-800"
							>
								Stop
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

function App() {
	return (
		<>
			<SpeechApp />
		</>
	);
}

export default App;
