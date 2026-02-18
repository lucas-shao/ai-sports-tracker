import React, { useState, useEffect, useRef } from 'react';
import { Record, SportStats, AppScreen, UserProfile } from './types';
import { analyzeSportText, generateWeeklyReport } from './services/geminiService';
import * as api from './services/api';

// Get user ID from environment variable
const DEFAULT_USER_ID = (process.env.DEFAULT_USER_ID || '').trim();

// --- Helper Components ---

const Header: React.FC<{ title?: string, showBack?: boolean, onBack?: () => void, rightAction?: React.ReactNode, transparent?: boolean }> = ({ title, showBack, onBack, rightAction, transparent }) => (
    <header className={`ios-notch-padding px-6 pt-4 pb-2 z-30 flex justify-between items-center ${transparent ? '' : 'bg-white dark:bg-background-dark/95 backdrop-blur sticky top-0'}`}>
        {showBack ? (
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <span className="material-icons-round text-gray-500 dark:text-gray-400">arrow_back_ios_new</span>
            </button>
        ) : (
            <div className="w-10"></div>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center">
            {rightAction || <div className="w-10"></div>}
        </div>
    </header>
);

// --- Screen Components ---

const HomeScreen: React.FC<{ onRecordComplete: (text: string) => void, onGoToDashboard: () => void, user: UserProfile }> = ({ onRecordComplete, onGoToDashboard, user }) => {
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        setIsRecording(true);
        // Simulate recording delay
        setTimeout(() => {
            setIsRecording(false);
            onRecordComplete("今天我颠了50个球！");
        }, 2000);
    };

    return (
        <div className="flex-1 flex flex-col relative overflow-hidden h-screen bg-background-light dark:bg-background-dark">
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-[80px]"></div>
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-pink-300/10 dark:bg-pink-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-[80px]"></div>
            </div>

            <header className="ios-notch-padding px-6 pt-6 pb-2 z-30 flex justify-end items-center">
                <button onClick={onGoToDashboard} className="group flex items-center gap-2 p-1 pr-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg shadow-indigo-500/5 border border-white/50 dark:border-gray-700 active:scale-95 transition-all">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        <img alt="User Avatar" class="w-full h-full object-cover" src={user.avatar} />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">进入</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">荣誉殿堂</span>
                    </div>
                </button>
            </header>

            <main className="flex-1 flex flex-col px-8 z-20 justify-center items-center gap-8">
                <div className="text-center space-y-6">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150"></div>
                        <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/10 rounded-[2.25rem] border-2 border-yellow-200/50 dark:border-yellow-700/30 shadow-2xl">
                            <span className="text-6xl filter drop-shadow-[0_8px_12px_rgba(234,179,8,0.2)] transform hover:scale-110 transition-transform duration-500 ease-out">🏆</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        今天创造了什么记录？
                    </h1>
                </div>

                <div className="relative flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/50 dark:border-gray-700 transition-all animate-fade-in-up">
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800/70 rotate-45 border-r border-b border-white/50 dark:border-gray-700"></div>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="material-icons-round text-indigo-500 text-lg">lightbulb</span>
                    </div>
                    <span className="text-base font-bold text-gray-700 dark:text-gray-200">“我今天颠了50个球！”</span>
                </div>

                <section className="flex flex-col items-center justify-center relative w-full pt-4">
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-primary/10 rounded-full scale-[1.5] ${isRecording ? 'animate-ping' : 'animate-pulse opacity-30'}`}></div>
                        <div className={`absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-125 ${isRecording ? 'opacity-70' : 'opacity-40'}`}></div>
                        <button
                            onClick={handleRecord}
                            className={`relative w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] transform transition-all active:scale-90 border-[8px] border-white dark:border-gray-800 z-10 overflow-hidden bg-[radial-gradient(circle_at_30%_30%,#6366F1_0%,#4F46E5_50%,#3730A3_100%)]`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
                            <span className="material-icons-round text-7xl text-white drop-shadow-lg mb-2">{isRecording ? 'graphic_eq' : 'mic'}</span>
                            <span className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">{isRecording ? '听取中...' : '录音中'}</span>
                        </button>
                    </div>
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <p className="text-sm font-black text-gray-400 dark:text-gray-500 tracking-[0.25em] uppercase">
                            {isRecording ? '正在记录你的声音' : '按住开始记录'}
                        </p>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce opacity-60" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce opacity-30" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </section>
            </main>
            <div className="ios-bottom-padding h-12"></div>
        </div>
    );
};

const ConfirmScreen: React.FC<{ initialText: string, onBack: () => void, onSave: (data: any) => void, existingSports: string[] }> = ({ initialText, onBack, onSave, existingSports }) => {
    const [text, setText] = useState(initialText);
    const [isRecording, setIsRecording] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analysis, setAnalysis] = useState<any>(null);

    useEffect(() => {
        // Simulate Gemini analysis
        const analyze = async () => {
            setIsAnalyzing(true);
            const result = await analyzeSportText(text, existingSports);
            setAnalysis(result);
            setIsAnalyzing(false);
            if (result.isNewSport) {
                setShowModal(true);
            }
        };
        analyze();
    }, [text, existingSports]);

    const handleReRecord = () => {
        setIsRecording(true);
        // Simulate recording delay
        setTimeout(() => {
            setIsRecording(false);
            // Simulate new result
            setText("今天我颠了66个球！");
        }, 2000);
    };

    const handleSave = () => {
        if (analysis?.isNewSport) {
            setShowModal(true);
        } else {
            onSave(analysis);
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
            </div>

            <Header title="确认记录" showBack onBack={onBack} transparent
                rightAction={
                    <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-0 pointer-events-none">
                        <span className="material-icons-round text-gray-500 dark:text-gray-400">more_horiz</span>
                    </button>
                }
            />

            <main className="flex-1 flex flex-col px-6 z-10 overflow-y-auto pb-48 pt-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        看看我记了什么！
                    </h2>
                </div>

                <section className="mb-8">
                    <div className="flex justify-between items-end mb-2 ml-1">
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400">语音内容</label>
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">
                            <span className="material-icons-round text-sm">auto_awesome</span>
                            <span>{isAnalyzing ? "AI 识别中..." : "AI 识别成功"}</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-3xl shadow-sm border-2 border-transparent transition-all leading-relaxed flex flex-wrap items-center gap-2 min-h-[120px]">
                            {isAnalyzing ? (
                                <span className="animate-pulse">Analyzing...</span>
                            ) : (
                                <>
                                    <span className="text-xl md:text-2xl font-bold">今天我{analysis?.sportName}了</span>
                                    <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-xl text-3xl font-black border-2 border-orange-200 dark:border-orange-500/30 shadow-sm inline-flex items-baseline gap-1">
                                        {analysis?.value}<span className="text-xl font-bold">{analysis?.unit}</span>
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="absolute bottom-4 right-4 text-primary bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full pointer-events-none">
                            <span className="material-icons-round text-xl block">edit</span>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1">照片记录</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                            <img alt="Sports photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuST_i-cg83ncijr8TveYOK4t3pQ_KqZ1y5yqQ1c0ytMg0SBnNKrsBCVL62ASkLOdRPIqcfmLVAJQwvxCSeUD1SIM5a_-kpyDxCth05Ozm4lgfN-kfzPXfSP1MZWWB8MKKlnla91xbj4ZfIXfSIX342N0zXluhZvAODCcPLJRKBTKfjrVe_R3BqeE3OsWACHT5stcH7lGhdA1Sg9aqYWYs5kQM0bEZB1kHtuxBV1H1ueB4oo_RdMVTxGrk9vQS2NcMZFAI0cRBR62t" />
                            <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
                                <span className="material-icons-round text-lg">close</span>
                            </button>
                        </div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                            <img alt="Sports photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtTOtRIRLMJHTIZyQk7isptpFWtwKmynIJg7o4bx8yXhA1UntCXj8wcFDs7Mzsslh6X8eNzstbIxV3RFSDNJjgcZdwXPYFCsvqQIyxoExCXA9HHA66-zg-qBq0uOQ7UWbVJIJf-QlMJXEyqlL4zPQJw-CAnnaSAqTzMdFeQXFv4yg4IyD1sVdb_HQTX_2MPr4ipgwSKmRHIH3T5EoHfCXFfgRzP2Y-zJ5K6N3K0RbWNFfRg33uLw_sCrEB8VJ37Re8_HbAIdBpwh8x" />
                            <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
                                <span className="material-icons-round text-lg">close</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-50 ios-bottom-padding rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="px-6 py-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleReRecord}
                            disabled={isRecording}
                            className={`flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-2xl transition-colors ${isRecording ? 'animate-pulse' : ''}`}
                        >
                            <span className="material-icons-round text-xl">{isRecording ? 'graphic_eq' : 'mic'}</span>
                            <span>{isRecording ? '听取中...' : '重新录音'}</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold py-3.5 rounded-2xl transition-colors">
                            <span className="material-icons-round text-xl">add_a_photo</span>
                            <span>添加照片</span>
                        </button>
                    </div>
                    <button onClick={handleSave} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transform transition active:scale-95 flex items-center justify-center gap-2 text-xl">
                        <span>保存记录</span>
                        <span className="material-icons-round">check_circle</span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary">emoji_events</span>
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-900 dark:text-white mb-3">
                            发现新运动！
                        </h3>
                        <p className="text-center text-gray-600 dark:text-gray-300 font-medium mb-8 leading-relaxed">
                            AI 发现你记录了一项新运动：<span className="text-primary font-bold">{analysis?.sportName}</span>，要把它存为一个新类别吗？
                        </p>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => onSave(analysis)} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg">
                                存为新类别
                            </button>
                            <button onClick={() => setShowModal(false)} className="w-full bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold py-3.5 rounded-xl active:scale-95 transition-all">
                                取消并修改
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const DashboardScreen: React.FC<{ user: UserProfile, onSelectSport: (id: string) => void, onRecord: () => void }> = ({ user, onSelectSport, onRecord }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#15202b] pb-32">
            <header className="pt-14 px-6 pb-4 bg-white dark:bg-[#15202b] sticky top-0 z-30">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img alt="Athlete avatar" className="w-14 h-14 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover" src={user.avatar} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">荣誉殿堂</h1>
                            <p className="text-xs text-slate-400 font-medium">个人运动成就</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 mb-2 relative border border-slate-100 dark:border-slate-800/50">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-50 dark:bg-slate-900/50 transform rotate-45 border-l border-t border-slate-100 dark:border-slate-800/50"></div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                        <span className="mr-1">🌟</span> {user.weeklyMessage}
                    </p>
                </div>
            </header>

            <div className="px-6 space-y-6 pb-8">
                {user.stats.map(stat => (
                    <div key={stat.id} onClick={() => onSelectSport(stat.id)} className="relative rounded-[2.5rem] overflow-hidden shadow-lg group cursor-pointer h-80 transition-transform active:scale-[0.98]">
                        <img alt={stat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={stat.image} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight drop-shadow-md">{stat.name}</h2>
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50"></div>
                                <div className="relative z-10 flex justify-between items-end">
                                    <div className="flex gap-6">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className="material-symbols-outlined text-yellow-400 text-sm drop-shadow">emoji_events</span>
                                                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider drop-shadow-sm">最高纪录</span>
                                            </div>
                                            <div className="text-2xl font-black text-white leading-none mb-1 drop-shadow-sm">{stat.bestRecord.value}<span className="text-xs ml-0.5 font-bold opacity-80">{stat.bestRecord.unit}</span></div>
                                            <div className="text-[10px] text-white/60 font-medium">{stat.bestRecord.date}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className="material-symbols-outlined text-blue-300 text-sm drop-shadow">history</span>
                                                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider drop-shadow-sm">最近记录</span>
                                            </div>
                                            <div className="text-2xl font-black text-white leading-none mb-1 drop-shadow-sm">{stat.recentRecord.value}<span className="text-xs ml-0.5 font-bold opacity-80">{stat.recentRecord.unit}</span></div>
                                            <div className="text-[10px] text-white/60 font-medium">{stat.recentRecord.date}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-[10px] font-bold text-white bg-white/20 pl-3 pr-2 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors hover:bg-white/30">
                                        查看历史 <span className="material-symbols-outlined text-[10px] ml-0.5">arrow_forward_ios</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/80 dark:bg-[#15202b]/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50 pb-10 pt-4 px-8 z-40 flex justify-center">
                <button onClick={onRecord} className="bg-primary text-white shadow-xl shadow-primary/30 rounded-full px-12 py-4 flex items-center gap-3 active:scale-95 transition-all w-full justify-center">
                    <span className="material-symbols-outlined fill-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                    <span className="font-bold text-lg">记录运动</span>
                </button>
            </div>
        </div>
    );
};

const HistoryScreen: React.FC<{ sport: SportStats, onBack: () => void }> = ({ sport, onBack }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <header className="px-6 pt-12 pb-6 bg-white dark:bg-[#15202b] sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{sport.name}历史记录</h1>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-indigo-100 dark:text-indigo-900/20 opacity-50 transform rotate-12">
                        <span className="material-symbols-outlined text-[100px] fill-1">smart_toy</span>
                    </div>
                    <div className="relative z-10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-ai-accent bg-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#8b5cf6]/30">
                            <span className="material-symbols-outlined text-white text-lg">auto_awesome</span>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider mb-1">AI 运动周报</h2>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                你已经坚持记录了 <span className="text-primary font-bold text-base">20</span> 天，继续加油！这周你的稳定性提升了 15%。
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4 relative no-scrollbar">
                <div className="absolute left-[3.25rem] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>

                {sport.history.map((record, index) => {
                    let tagConfig = { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", icon: "check_circle", label: "完成打卡" };
                    if (record.tags?.includes('broken_record')) tagConfig = { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", icon: "trending_up", label: "破纪录" };
                    if (record.tags?.includes('improved')) tagConfig = { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", icon: "bolt", label: "进步了" };
                    if (record.tags?.includes('stable')) tagConfig = { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", icon: "anchor", label: "保持稳定" };
                    if (record.tags?.includes('keep_going')) tagConfig = { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", icon: "fitness_center", label: "继续加油" };

                    const showImage = record.images && record.images.length > 0;
                    const imageSrc = showImage ? record.images![0] : (index % 2 === 0 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwU2QFZMnJs3Qeibv_zjjHMnAhSbwoBBsqHe5FJfngtmlGevDf2_5pUPZDL7x1RmTcdty6hULWm0knZc8rZ9VRsCx7VYJ2GO88p7bEdVPKf9uTw7VlzW0maN1vQDkPZyx8va2K3QpX7wBzdVMuZRa82_3uEdYUR_6D8PaeqUbDhb0k23VZWuoiU7GQ-qqHglUPZzz7LmYYnGMWZ1EI1ENXsER_ts7nQ5BsSYEHqd99ZbikxF9bVz3y4BWKe5UZDO1QxgpXXEKsZOi" : null);

                    return (
                        <div key={record.id} className={`relative flex items-center gap-4 z-10 group ${index > 3 ? 'opacity-70' : ''}`}>
                            <div className={`w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-md ${!showImage && 'bg-slate-100 dark:bg-slate-800 flex items-center justify-center'}`}>
                                {showImage || imageSrc ? (
                                    <img alt="Thumbnail" className={`w-full h-full object-cover ${!showImage && 'opacity-80'}`} src={imageSrc || ""} />
                                ) : (
                                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">sports_soccer</span>
                                )}
                            </div>
                            <div className="flex-1 bg-white dark:bg-[#1e2a3b] rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700/50 flex justify-between items-center transition-transform active:scale-[0.98]">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{record.value}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase mt-1">{record.unit}</span>
                                        <span className={`px-2 py-0.5 rounded-full ${tagConfig.bg} ${tagConfig.text} text-[10px] font-bold flex items-center gap-0.5`}>
                                            <span className="material-symbols-outlined text-[10px]">{tagConfig.icon}</span> {tagConfig.label}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium">{record.date}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="pb-10"></div>
            </main>
        </div>
    );
};


// --- App Main ---

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
    const [recordedText, setRecordedText] = useState("");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSportId, setSelectedSportId] = useState<string | null>(null);

    // Fetch user profile on mount
    useEffect(() => {
        const loadUserProfile = async () => {
            if (!DEFAULT_USER_ID) {
                setError('请在 .env.local 中设置 DEFAULT_USER_ID。运行 npm run seed 创建用户。');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const profile = await api.fetchUserProfile(DEFAULT_USER_ID);
                setUser(profile);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load user profile:', err);
                setError(`无法加载用户数据: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const handleRecordComplete = (text: string) => {
        setRecordedText(text);
        setCurrentScreen(AppScreen.CONFIRM);
    };

    const handleConfirmSave = async (analysis: any) => {
        if (!user) return;

        try {
            // Check if sport exists or create new one
            let sportId = user.stats.find(s => s.name === analysis.sportName)?.id;

            if (analysis.isNewSport || !sportId) {
                // Create new sport
                const newSport = await api.createSport(user.id!, analysis.sportName);
                sportId = newSport.id;
            }

            // Create the record
            await api.createRecord({
                sportId: sportId!,
                userId: user.id!,
                value: analysis.value,
                unit: analysis.unit,
                date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                tags: ['improved'],
                images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCuST_i-cg83ncijr8TveYOK4t3pQ_KqZ1y5yqQ1c0ytMg0SBnNKrsBCVL62ASkLOdRPIqcfmLVAJQwvxCSeUD1SIM5a_-kpyDxCth05Ozm4lgfN-kfzPXfSP1MZWWB8MKKlnla91xbj4ZfIXfSIX342N0zXluhZvAODCcPLJRKBTKfjrVe_R3BqeE3OsWACHT5stcH7lGhdA1Sg9aqYWYs5kQM0bEZB1kHtuxBV1H1ueB4oo_RdMVTxGrk9vQS2NcMZFAI0cRBR62t"]
            });

            // Reload user profile to get updated data
            const updatedProfile = await api.fetchUserProfile(user.id!);
            setUser(updatedProfile);
            setCurrentScreen(AppScreen.DASHBOARD);
        } catch (err: any) {
            console.error('Failed to save record:', err);
            alert('保存失败: ' + err.message);
        }
    };

    const handleSelectSport = (id: string) => {
        setSelectedSportId(id);
        setCurrentScreen(AppScreen.HISTORY);
    }

    // Loading state
    if (loading) {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-background-dark shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !user) {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-background-dark shadow-2xl overflow-hidden flex items-center justify-center p-8">
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-red-500 mb-4">error_outline</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">无法加载数据</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                    >
                        重新加载
                    </button>
                </div>
            </div>
        );
    }

    // Router Logic
    let content;
    switch (currentScreen) {
        case AppScreen.HOME:
            content = <HomeScreen onRecordComplete={handleRecordComplete} onGoToDashboard={() => setCurrentScreen(AppScreen.DASHBOARD)} user={user} />;
            break;
        case AppScreen.CONFIRM:
            content = <ConfirmScreen initialText={recordedText} onBack={() => setCurrentScreen(AppScreen.HOME)} onSave={handleConfirmSave} existingSports={user.stats.map(s => s.name)} />;
            break;
        case AppScreen.DASHBOARD:
            content = <DashboardScreen user={user} onSelectSport={handleSelectSport} onRecord={() => setCurrentScreen(AppScreen.HOME)} />;
            break;
        case AppScreen.HISTORY:
            const sport = user.stats.find(s => s.id === selectedSportId);
            if (sport) {
                content = <HistoryScreen sport={sport} onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
            } else {
                content = <div>Sport not found</div>;
            }
            break;
        default:
            content = <HomeScreen onRecordComplete={handleRecordComplete} onGoToDashboard={() => setCurrentScreen(AppScreen.DASHBOARD)} user={user} />;
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-background-dark shadow-2xl overflow-hidden">
            {content}
        </div>
    );
}

export default App;