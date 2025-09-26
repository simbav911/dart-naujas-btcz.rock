---
title: "VaultZ Community Fund"
description: "Monitor the BitcoinZ community vault balances in real-time. VaultZ is our democratized donation mechanism that allocates 5% of block rewards to sustain the BitcoinZ ecosystem through development, marketing, and community initiatives."
date: 2025-09-21T00:00:00Z
draft: false
layout: vaultz
---

{{< rawhtml >}}
<!-- Overview Section -->
<div class="mb-16">
    <!-- What is VaultZ -->
    <div class="content-card p-8 max-w-5xl mx-auto">
        <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">What is VaultZ?</h2>
        </div>
        <p class="text-gray-300 leading-relaxed mb-6">
            VaultZ is BitcoinZ's democratized funding mechanism that automatically allocates
            <span class="text-blue-400 font-semibold">5% of all block rewards</span> to community funds.
            This transparent system, approved by <span class="text-green-400 font-semibold">96% of the community</span>,
            ensures sustainable growth and development of the BitcoinZ ecosystem.
        </p>

        <!-- Key Features -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                    <h4 class="text-white font-medium">Automatic Collection</h4>
                    <p class="text-gray-400 text-sm">5% of every block reward automatically allocated</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                    <h4 class="text-white font-medium">Community Governed</h4>
                    <p class="text-gray-400 text-sm">All decisions made by community consensus</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                    <h4 class="text-white font-medium">Complete Transparency</h4>
                    <p class="text-gray-400 text-sm">Every transaction publicly visible on blockchain</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                    <h4 class="text-white font-medium">Decentralized Control</h4>
                    <p class="text-gray-400 text-sm">No central authority manages the funds</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Live Balance Section -->
<div class="mb-16" id="balance-section">
    <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-4">Live Fund Balance</h2>
        <p class="text-gray-400 max-w-2xl mx-auto">
            Real-time monitoring of VaultZ community funds across all addresses.
            Data is updated automatically from the BitcoinZ blockchain.
        </p>
    </div>

    <div class="balance-display glass-effect p-8">
        <!-- Loading State -->
        <div id="vaultz-loading" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
                <div class="animate-spin rounded-full h-12 w-12" style="border: 2px solid rgba(255, 215, 0, 0.2); border-top: 2px solid #FFD700;"></div>
            </div>
            <h3 class="text-xl font-semibold mb-2" style="color: #FFD700;">Loading Balance</h3>
            <p class="text-gray-400">Fetching data from blockchain...</p>
        </div>

        <!-- Error State -->
        <div id="vaultz-error" class="hidden text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-red-400 mb-2">Connection Error</h3>
            <p class="text-gray-400 mb-6">Unable to fetch balance data. Please try again.</p>
            <button onclick="window.vaultzBalance.refreshBalance()" class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25">
                Retry Connection
            </button>
        </div>

        <!-- Balance Content -->
        <div id="vaultz-content" class="hidden">
            <!-- Main Balance Display -->
            <div class="text-center mb-8">
                <div class="inline-flex items-baseline justify-center gap-4 mb-4">
                    <span id="total-balance" class="golden-balance text-5xl md:text-7xl font-bold font-mono tracking-tight" role="status" aria-live="polite">0</span>
                    <span class="text-2xl md:text-3xl font-semibold" style="color: #FACC15;">BTCZ</span>
                </div>
                <p class="text-gray-400 text-lg">Total Community Fund Balance</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="glass-card p-6 text-center transition-all duration-300" style="border: 1px solid rgba(255, 215, 0, 0.2);">
                    <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));">
                        <svg class="w-6 h-6" style="color: #FFD700;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div id="address-count" class="text-2xl font-bold mb-1" style="color: #FFD700;">0</div>
                    <div class="text-gray-400 text-sm">Active Addresses</div>
                </div>

                <div class="glass-card p-6 text-center transition-all duration-300" style="border: 1px solid rgba(255, 215, 0, 0.2);">
                    <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));">
                        <svg class="w-6 h-6" style="color: #FFD700;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div id="last-updated" class="text-2xl font-bold mb-1" style="color: #FFD700;">Never</div>
                    <div class="text-gray-400 text-sm">Last Updated</div>
                </div>

                <div class="glass-card p-6 text-center transition-all duration-300" style="border: 1px solid rgba(255, 215, 0, 0.2);">
                    <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));">
                        <svg class="w-6 h-6" style="color: #FFD700;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold mb-1" style="color: #FFD700;">Live</div>
                    <div class="text-gray-400 text-sm">Real-time Data</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <button id="refresh-balance" class="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; border: none;">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Refresh Balance
                </button>

                <button id="toggle-addresses" class="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300" style="border: 2px solid #FFD700; color: #FFD700; background: transparent;">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    View All Addresses
                </button>
            </div>

            <!-- Address List -->
            <div id="address-list" class="hidden">
                <div class="glass-card p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h4 class="text-xl font-semibold text-white flex items-center gap-3">
                            <div class="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            VaultZ Addresses
                        </h4>
                        <span class="text-gray-400 text-sm">
                            <span id="addresses-count">0</span> total addresses
                        </span>
                    </div>
                    <div id="addresses-container" class="space-y-3"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Funding Section -->
<div id="proposal-section" class="mb-16">
    <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Get VaultZ Funding</h2>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Apply for a community grant to build apps, tools, content, or growth initiatives for BitcoinZ.
            Simple 5-step process, milestone-based payouts, open to individuals and teams.
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- How to Apply -->
        <div class="content-card p-8">
            <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white">How to Apply</h3>
            </div>

            <div class="space-y-6">
                <div class="step-card p-6 flex items-start">
                    <div class="apply-step-badge mr-8 flex-shrink-0">1</div>
                    <div>
                        <h4 class="font-semibold text-white mb-2 text-lg">Join the Community</h4>
                        <p class="text-gray-400">Connect via Discord or Forum to discuss your idea with the community</p>
                    </div>
                </div>

                <div class="step-card p-6 flex items-start">
                    <div class="apply-step-badge mr-8 flex-shrink-0">2</div>
                    <div>
                        <h4 class="font-semibold text-white mb-2 text-lg">Draft Your Proposal</h4>
                        <p class="text-gray-400">Detail your project scope, timeline, budget, and expected outcomes</p>
                    </div>
                </div>

                <div class="step-card p-6 flex items-start">
                    <div class="apply-step-badge mr-8 flex-shrink-0">3</div>
                    <div>
                        <h4 class="font-semibold text-white mb-2 text-lg">Community Review</h4>
                        <p class="text-gray-400">Open discussion period for feedback and refinements</p>
                    </div>
                </div>

                <div class="step-card p-6 flex items-start">
                    <div class="apply-step-badge mr-8 flex-shrink-0">4</div>
                    <div>
                        <h4 class="font-semibold text-white mb-2 text-lg">Community Decision</h4>
                        <p class="text-gray-400">Community sentiment guides funding decisions within BitcoinZ principles</p>
                    </div>
                </div>

                <div class="step-card p-6 flex items-start">
                    <div class="apply-step-badge mr-8 flex-shrink-0">5</div>
                    <div>
                        <h4 class="font-semibold text-white mb-2 text-lg">Receive Funding</h4>
                        <p class="text-gray-400">Approved proposals receive VaultZ funding to execute the project</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Funding Categories -->
        <div class="content-card p-8">
            <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white">What Gets Funded</h3>
            </div>

            <div class="space-y-4">
                <div class="flex items-center p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white">Development</h4>
                        <p class="text-gray-400 text-sm">Core improvements, new features, developer tools</p>
                    </div>
                </div>

                <div class="flex items-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white">Marketing</h4>
                        <p class="text-gray-400 text-sm">Promotion campaigns, content creation, outreach</p>
                    </div>
                </div>

                <div class="flex items-center p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white">Community</h4>
                        <p class="text-gray-400 text-sm">Events, rewards, educational content, community building</p>
                    </div>
                </div>

                <div class="flex items-center p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white">Innovation</h4>
                        <p class="text-gray-400 text-sm">Research, experiments, new initiatives, infrastructure</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
        <div class="glass-effect p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold text-white mb-4">Ready to Submit Your Proposal?</h3>
            <p class="text-gray-300 mb-6">
                Join our community and start the conversation about your innovative idea.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://discord.gg/bitcoinz" target="_blank" class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 inline-flex items-center justify-center gap-4">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Join Discord
                </a>
                <a href="https://t.me/bitcoinzcommunity" target="_blank" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 inline-flex items-center justify-center gap-4">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    Join Telegram
                </a>
            </div>
        </div>
    </div>
</div>

<!-- VaultZ History -->
<div class="mb-16">
    <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">VaultZ Evolution</h2>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            A timeline of community-driven milestones that shaped VaultZ into the
            transparent and democratic funding system it is today.
        </p>
    </div>

    <div class="content-card p-8">
        <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

            <!-- Timeline Items -->
            <div class="space-y-8">
                <div class="flex items-start">
                    <div class="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span class="text-white font-bold text-sm">2018</span>
                    </div>
                    <div class="pt-3">
                        <h4 class="text-xl font-bold text-white mb-2">Birth of VaultZ</h4>
                        <p class="text-gray-300 leading-relaxed">
                            Community proposal approved with <span class="text-blue-400 font-semibold">96% support</span>,
                            establishing the foundation for democratized funding and launching the revolution
                            against centralized financial control.
                        </p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="relative z-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span class="text-white font-bold text-sm">2019</span>
                    </div>
                    <div class="pt-3">
                        <h4 class="text-xl font-bold text-white mb-2">Foundation of Freedom</h4>
                        <p class="text-gray-300 leading-relaxed">
                            VaultZ implementation completed and first community funds collected,
                            securing true independence from centralized systems and establishing
                            transparent blockchain-based governance.
                        </p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="relative z-10 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span class="text-white font-bold text-sm">2021</span>
                    </div>
                    <div class="pt-3">
                        <h4 class="text-xl font-bold text-white mb-2">Unity & Strength</h4>
                        <p class="text-gray-300 leading-relaxed">
                            VaultZ Era 2 approved with <span class="text-green-400 font-semibold">100% positive votes</span>,
                            proving unbreakable community resolve and commitment to decentralized governance principles.
                        </p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span class="text-white font-bold text-sm">2022</span>
                    </div>
                    <div class="pt-3">
                        <h4 class="text-xl font-bold text-white mb-2">Global Expansion</h4>
                        <p class="text-gray-300 leading-relaxed">
                            Army-Z 2.0 marketing initiative funded and launched, spreading the freedom message
                            globally and awakening minds worldwide to the possibilities of true decentralization.
                        </p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="relative z-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span class="text-white font-bold text-sm">2025</span>
                    </div>
                    <div class="pt-3">
                        <h4 class="text-xl font-bold text-white mb-2">Continued Innovation</h4>
                        <p class="text-gray-300 leading-relaxed">
                            Ongoing community initiatives and technological advancement, with VaultZ continuing
                            to fund projects that strengthen the ecosystem and promote digital sovereignty.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <p class="text-gray-300 text-center italic">
                Each milestone represents the community's growing commitment to digital sovereignty
                and the unstoppable march toward true financial freedom. VaultZ empowers every voice
                in the global movement for decentralization.
            </p>
        </div>
    </div>
</div>

<!-- Governance Section -->
<div class="mb-16">
    <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">How Funding Decisions Are Made</h2>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Proposals are discussed in public, voted on by the community, and paid out in milestones from a public multisig.
            Every vote, decision, and transaction is transparent and auditable.
        </p>
        <div class="text-gray-300 max-w-3xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-left">
            <div class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span><span>Public discussion in Discord and the Forum</span></div>
            <div class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span><span>Community voting on proposals</span></div>
            <div class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span><span>Milestone reviews before each payout</span></div>
            <div class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span><span>Transparent payouts from a public multisig</span></div>
        </div>

    </div>

    <div class="content-card p-8 mb-8">
        <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-white">Governance Process</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
            <div class="governance-step text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105" style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); animation-delay: 0.2s;">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-bold mx-auto mb-6 text-3xl" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5), 0 0 0 3px rgba(255, 215, 0, 0.3);">1</div>
                <h4 class="font-bold text-xl mb-4" style="color: #FFD700;">Proposal</h4>
                <p class="text-gray-300 text-base leading-relaxed">Community members submit detailed funding proposals with clear objectives and budgets</p>
            </div>

            <div class="governance-step text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105" style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); animation-delay: 0.4s;">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-bold mx-auto mb-6 text-3xl" style="background: linear-gradient(135deg, #FFD700, #FF8F00); color: #000; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5), 0 0 0 3px rgba(255, 215, 0, 0.3);">2</div>
                <h4 class="font-bold text-xl mb-4" style="color: #FFD700;">Discussion</h4>
                <p class="text-gray-300 text-base leading-relaxed">Community discussion and feedback on Telegram and Discord channels</p>
            </div>

            <div class="governance-step text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105" style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); animation-delay: 0.6s;">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-bold mx-auto mb-6 text-3xl" style="background: linear-gradient(135deg, #FFC107, #FF9800); color: #000; box-shadow: 0 10px 30px rgba(255, 193, 7, 0.5), 0 0 0 3px rgba(255, 193, 7, 0.3);">3</div>
                <h4 class="font-bold text-xl mb-4" style="color: #FFD700;">Review</h4>
                <p class="text-gray-300 text-base leading-relaxed">Community sentiment analysis and alignment with BitcoinZ principles</p>
            </div>

            <div class="governance-step text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105" style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); animation-delay: 0.8s;">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-bold mx-auto mb-6 text-3xl" style="background: linear-gradient(135deg, #FFB300, #FF8F00); color: #000; box-shadow: 0 10px 30px rgba(255, 179, 0, 0.5), 0 0 0 3px rgba(255, 179, 0, 0.3);">4</div>
                <h4 class="font-bold text-xl mb-4" style="color: #FFD700;">Decision</h4>
                <p class="text-gray-300 text-base leading-relaxed">Community-guided funding decisions based on consensus and merit</p>
            </div>

            <div class="governance-step text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105" style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); animation-delay: 1.0s;">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-bold mx-auto mb-6 text-3xl" style="background: linear-gradient(135deg, #FFA000, #FF6F00); color: #000; box-shadow: 0 10px 30px rgba(255, 160, 0, 0.5), 0 0 0 3px rgba(255, 160, 0, 0.3);">5</div>
                <h4 class="font-bold text-xl mb-4" style="color: #FFD700;">Execution</h4>
                <p class="text-gray-300 text-base leading-relaxed">Transparent funding distribution with public tracking and accountability</p>
            </div>
        </div>
    </div>

    <!-- Governance Principles -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="content-card p-6">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h4 class="text-lg font-semibold text-white">Core Principles</h4>
            </div>
            <ul class="space-y-2 text-gray-300">
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Respect BitcoinZ white paper principles</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Maintain decentralized governance</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Ensure complete transparency</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Benefit the entire ecosystem</span>
                </li>
            </ul>
        </div>

        <div class="content-card p-6">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h4 class="text-lg font-semibold text-white">Decision Criteria</h4>
            </div>
            <ul class="space-y-2 text-gray-300">
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Community support and engagement</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Technical feasibility and merit</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Ecosystem impact and value</span>
                </li>
                <li class="flex items-start">
                    <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Alignment with project goals</span>
                </li>
            </ul>
        </div>
    </div>

    <!-- Final Message -->
    <div class="text-center mt-12">
        <div class="glass-effect p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 class="text-2xl font-bold text-white mb-4">True Decentralization in Action</h3>
            <p class="text-gray-300 leading-relaxed">
                The VaultZ system exemplifies BitcoinZ's commitment to true decentralization and community governance.
                Every decision is made by the community, for the community, ensuring that our ecosystem remains
                truly democratic and aligned with our foundational principles of freedom and transparency.
            </p>
        </div>
    </div>
</div>

<style>
/* Golden Balance Styling - Override burning-text */
.golden-balance {
    background: linear-gradient(45deg, #FFD700, #FFA500, #FFED4E, #FFD700) !important;
    background-size: 400% 400% !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
    animation: golden-gradient 8s ease-in-out infinite !important;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.3), 0 0 60px rgba(255, 237, 78, 0.2) !important;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)) !important;
}

@keyframes golden-gradient {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

/* Override any existing burning-text styles */
#total-balance.golden-balance {
    background: linear-gradient(45deg, #FFD700, #FFA500, #FFED4E, #FFD700) !important;
    background-size: 400% 400% !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    animation: golden-gradient 8s ease-in-out infinite !important;
}

/* Governance Steps Staggered Animation */
.governance-step {
    opacity: 0;
    transform: translateY(30px);
    animation: governanceStepIn 0.8s ease-out forwards;
}

@keyframes governanceStepIn {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Enhanced hover effect for governance steps */
.governance-step:hover {
    transform: translateY(-5px) scale(1.02) !important;
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.2) !important;
}

/* How-to-Apply number badge — high-contrast, professional look */
.apply-step-badge {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 0.3px;
    color: #000;
    background: linear-gradient(135deg, #FFD700, #FF9F0A);
    border: 2px solid rgba(255, 215, 0, 0.7);
    margin-right: 2.5rem;
    box-shadow:
        0 6px 14px rgba(255, 193, 7, 0.22),
        0 0 0 2px rgba(255, 215, 0, 0.12),
        inset 0 2px 5px rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(4px);
}

.apply-step-badge::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0) 55%);
    pointer-events: none;
}

@media (max-width: 640px) {
    .apply-step-badge { width: 56px; height: 56px; font-size: 18px; margin-right: 1.25rem; }
}
</style>
{{< /rawhtml >}}