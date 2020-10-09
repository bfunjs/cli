module.exports = {
    base: '/docs/cn/cli/',
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'bfun CLI',
            description: '@bfun/cli 文档中心',
        },
    },
    themeConfig: {
        displayAllHeaders: true,
        locales: {
            '/': {
                label: '简体中文',
                selectText: '选择语言',
                nav: [
                    {
                        text: '指南',
                        link: '/guide/',
                    },
                    {
                        text: '配置参考',
                        items: [
                            {
                                text: 'CLI 配置',
                                link: '/config/b-config/',
                            },
                            {
                                text: 'solution-webpack4-standard',
                                link: '/config/solution-webpack4-standard/',
                            },
                            {
                                text: 'solution-webpack4-vue',
                                link: '/config/solution-webpack4-vue2/',
                            },
                        ],
                    },
                    {
                        text: 'GitHub',
                        link: 'https://github.com/bfunjs/cli',
                    },
                ],
                sidebar: {
                    '/guide/': [
                        '/guide/',
                        {
                            title: '基础使用',
                            collapsable: false,
                            children: [
                                '/guide/BConfig',
                                '/guide/Plugin',
                                '/guide/Solution',
                            ],
                        },
                    ],
                    '/config/': [
                        '/config/',
                    ],
                    '/template/': [
                        '/template/',
                    ],
                },
            },
        },
    },
};
