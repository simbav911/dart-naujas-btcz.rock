export const contentTypes = {
    news: {
        path: 'news',
        template: {
            frontMatter: (title) => ({
                title: title,
                date: new Date().toISOString(),
                draft: false,
                author: "BitcoinZ Team",
                categories: ["Update"],
                tags: [],
                type: "news",
                layout: "single"
            })
        }
    },
    wallets: {
        path: 'wallets',
        template: {
            frontMatter: (data) => ({
                title: data.title,
                description: data.description,
                date: new Date().toISOString(),
                type: "wallet",
                image: data.image,
                features: data.features,
                platforms: data.platforms,
                requirements: data.requirements,
                draft: false
            })
        }
    },
    roadmap: {
        path: 'roadmap',
        template: {
            frontMatter: (data) => ({
                title: data.title,
                description: data.description,
                date: new Date().toISOString(),
                year: new Date().getFullYear(),
                section: "roadmap",
                type: "roadmap",
                layout: "single",
                status: data.status,
                progress: data.progress,
                tags: data.tags,
                icon: data.icon,
                priority: data.priority
            })
        }
    }
};