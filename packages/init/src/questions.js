const inquirer = require('inquirer');

export async function QBfunDefault(ctx, def) {
    if (!ctx.data) ctx.data = {};
    const questions = [
        {
            'type': 'list',
            'name': 'type',
            'message': '请选择项目模板',
            'choices': [
                '@bfun/component 组件',
                '@bfun/template 模板',
                '@bfun/plugin 插件',
                '@bfun/solution 解决方案',
                '@demo/vue VueDemo',
            ],
        },
        {
            'type': 'input',
            'message': '请输入项目名',
            'name': 'name',
            'default': def.name || '',
        },
        {
            'type': 'input',
            'message': '请输入简介',
            'name': 'description',
        },
        {
            'type': 'input',
            'message': '请输入作者名',
            'name': 'author',
        },
    ];
    switch (def.tmpl) {
        case 'c':
        case 'v':
        case 'view':
        case 'comp':
        case 'component':
        case '@bfun/component':
            ctx.data = { ...ctx.data, tmpl: '@bfun/component' };
            questions.shift();
            break;
        case 't':
        case 'tmpl':
        case 'template':
        case '@bfun/template':
            ctx.data = { ...ctx.data, tmpl: '@bfun/template' };
            questions.shift();
            break;
        case 'p':
        case 'plugin':
        case '@bfun/plugin':
            ctx.data = { ...ctx.data, tmpl: '@bfun/plugin' };
            questions.shift();
            break;
        case 's':
        case 'solution':
        case '@bfun/solution':
            ctx.data = { ...ctx.data, tmpl: '@bfun/solution' };
            questions.shift();
            break;
    }

    const answers = await inquirer.prompt(questions);
    if (answers.type) {
        ctx.data.tmpl = answers.type.split(' ')[0];
    }
    ctx.data = {
        ...ctx.data,
        name: answers.name,
        description: answers.description,
        author: answers.author,
    };
    if (ctx.data.tmpl === '@demo/vue') {
        await QDemoVue(ctx, def);
    } else {
        switch (ctx.data.tmpl) {
            case '@bfun/component':
                ctx.repo = {
                    'type': 'tar',
                    'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/bfun-component.tar?raw=true',
                };
                break;
            case '@bfun/template':
                ctx.repo = {
                    'type': 'tar',
                    'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/bfun-template.tar?raw=true',
                };
                break;
            case '@bfun/solution':
                ctx.repo = {
                    'type': 'tar',
                    'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/bfun-solution.tar?raw=true',
                };
                break;
            case '@bfun/plugin':
                ctx.repo = {
                    'type': 'tar',
                    'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/bfun-plugin.tar?raw=true',
                };
                break;
        }
    }
    console.log(ctx.data);
}

export async function QDemoVue(ctx, def) {
    const questions = [
        {
            'type': 'input',
            'message': '请输入初始页面名(为空则为单页Vue应用)',
            'name': 'page',
        },
    ];
    const answers = def.page ? { page: def.page } : await inquirer.prompt(questions);
    if (answers.page) {
        ctx.data.page = answers.page;
        ctx.repo = {
            'type': 'tar',
            'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/vue-multi-with-static-page.tar?raw=true',
        };
    } else {
        ctx.repo = {
            'type': 'tar',
            'url': 'https://github.com/bfunjs/bfun-templates/blob/master/dist/vue-basic.tar?raw=true',
        };
    }
}
