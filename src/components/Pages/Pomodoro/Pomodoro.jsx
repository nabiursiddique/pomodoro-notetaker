import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const Pomodoro = () => {
    // Settings state (in minutes)
    const [settings, setSettings] = useState({
        work: 25,
        shortBreak: 5,
        longBreak: 15,
    });

    // Current active mode: 'work' | 'shortBreak' | 'longBreak'
    const [mode, setMode] = useState('work');

    // Time remaining in seconds
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Settings Modal open/close state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Reference for interval
    const timerRef = useRef(null);

    // Total time for calculating circular progress percentage
    const totalTimeForMode = (settings[mode] || 25) * 60;
    const progressPercent = ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100;

    // Handle mode switching
    const switchMode = useCallback((newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(settings[newMode] * 60);
    }, [settings]);

    // Timer finish logic declared before useEffect
    const handleTimerEnd = useCallback(() => {
        setIsRunning(false);

        // Play alert sound if needed
        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
        } catch (e) {
            console.log('Audio playback error:', e);
        }

        if (mode === 'work') {
            setSessionsCompleted((prev) => prev + 1);
            // Auto-switch to short break
            switchMode('shortBreak');
        } else {
            // Switch back to work mode
            switchMode('work');
        }
    }, [mode, switchMode]);

    // Handle countdown logic
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        handleTimerEnd();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, handleTimerEnd]);

    // Toggle Play / Pause
    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    // Reset current timer
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(settings[mode] * 60);
    };

    // Save new settings
    const handleSaveSettings = (e) => {
        e.preventDefault();
        const newWork = parseInt(e.target.work.value, 10) || 25;
        const newShort = parseInt(e.target.shortBreak.value, 10) || 5;
        const newLong = parseInt(e.target.longBreak.value, 10) || 15;

        const updatedSettings = {
            work: newWork,
            shortBreak: newShort,
            longBreak: newLong,
        };

        setSettings(updatedSettings);
        setIsRunning(false);
        setTimeLeft(updatedSettings[mode] * 60);
        setIsSettingsOpen(false);
    };

    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Mode badge color/label helper
    const getModeLabel = () => {
        switch (mode) {
            case 'work':
                return { text: 'Focus Time', color: 'badge-primary' };
            case 'shortBreak':
                return { text: 'Short Break', color: 'badge-secondary' };
            case 'longBreak':
                return { text: 'Long Break', color: 'badge-accent' };
            default:
                return { text: 'Focus Time', color: 'badge-primary' };
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
                <div className="card-body items-center text-center p-6 sm:p-8">

                    {/* Header */}
                    <div className="w-full flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold tracking-wide">Pomodoro</h1>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="btn btn-ghost btn-circle btn-sm"
                            title="Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Mode Switcher Tabs */}
                    <div className="tabs tabs-boxed mb-6 bg-base-200 p-1">
                        <button
                            className={`tab ${mode === 'work' ? 'tab-active' : ''}`}
                            onClick={() => switchMode('work')}
                        >
                            Focus
                        </button>
                        <button
                            className={`tab ${mode === 'shortBreak' ? 'tab-active' : ''}`}
                            onClick={() => switchMode('shortBreak')}
                        >
                            Short Break
                        </button>
                        <button
                            className={`tab ${mode === 'longBreak' ? 'tab-active' : ''}`}
                            onClick={() => switchMode('longBreak')}
                        >
                            Long Break
                        </button>
                    </div>

                    {/* Mode Indicator Badge */}
                    <div className={`badge ${getModeLabel().color} badge-outline mb-4 p-3 font-medium uppercase tracking-wider text-xs`}>
                        {getModeLabel().text}
                    </div>

                    {/* Main Timer Display with Circular Ring */}
                    <div className="relative flex items-center justify-center my-4">
                        <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
                            {/* Background Ring */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r="42%"
                                className="stroke-base-200"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Progress Ring */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r="42%"
                                className={`transition-all duration-1000 ease-linear ${mode === 'work' ? 'stroke-primary' : mode === 'shortBreak' ? 'stroke-secondary' : 'stroke-accent'
                                    }`}
                                strokeWidth="8"
                                strokeDasharray="264"
                                strokeDashoffset={264 - (264 * progressPercent) / 100}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </svg>

                        {/* Timer Digits */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs text-base-content/60 mt-2 font-semibold">
                                {isRunning ? 'RUNNING' : 'PAUSED'}
                            </span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center gap-4 mt-6">
                        {/* Reset Button */}
                        <button
                            onClick={resetTimer}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-base-200"
                            title="Reset Timer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Play/Pause Button */}
                        <button
                            onClick={toggleTimer}
                            className={`btn btn-lg btn-wide ${isRunning ? 'btn-warning' : 'btn-primary'} text-white shadow-lg`}
                        >
                            {isRunning ? 'PAUSE' : 'START'}
                        </button>

                        {/* Skip/Finish Button */}
                        <button
                            onClick={handleTimerEnd}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-base-200"
                            title="End / Skip Session"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Session Stats */}
                    <div className="stats shadow bg-base-200 mt-8 w-full border border-base-300">
                        <div className="stat text-center py-3">
                            <div className="stat-title text-xs">Completed Sessions</div>
                            <div className="stat-value text-xl text-primary">{sessionsCompleted}</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* DaisyUI Modal for Settings */}
            {isSettingsOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Timer Settings (Minutes)</h3>
                        <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Focus Duration</span>
                                </label>
                                <input
                                    type="number"
                                    name="work"
                                    min="1"
                                    max="120"
                                    defaultValue={settings.work}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Short Break Duration</span>
                                </label>
                                <input
                                    type="number"
                                    name="shortBreak"
                                    min="1"
                                    max="60"
                                    defaultValue={settings.shortBreak}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Long Break Duration</span>
                                </label>
                                <input
                                    type="number"
                                    name="longBreak"
                                    min="1"
                                    max="60"
                                    defaultValue={settings.longBreak}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pomodoro;