/*
 * @Author: wush wush@example.com
 * @Date: 2022-07-12 09:33:13
 * @LastEditors: wush wush@example.com
 * @LastEditTime: 2022-07-14 17:50:40
 * @FilePath: \mgy-app\pages\product\data.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const dataList = [{
        name: '一级分类',
        id: '1',
        user: false,
        children: [{
                name: '二级分类',
                id: '2-1',
                user: false,
                children: [{
                        name: '三级分类',
                        id: '3-1',
                        user: false,
                        children: [{
                                name: '四级分类',
                                id: '4-1',
                                user: false,
                                children: [{
                                        name: '五级分类',
                                        id: '5-1',
                                        user: false,
                                        children: [{
                                                name: '六级分类',
                                                id: '6-1',
                                                user: true,
                                            },
                                            // ...make(5)
                                        ]
                                    },
                                    // ...make(4)
                                ]
                            },
                            // ...make(3)
                        ]
                    },
                    // ...make(2)
                ],
            },
            // ...make('二')
        ]
    },
    {
        name: '一级分类',
        id: '2-1',
        user: false,
        children: [{
            name: '二级分类',
            id: '3-1',
            user: false,
            children: [{
                name: '三级分类',
                id: '4-1',
                user: false,
                children: [{
                    name: '四级分类',
                    id: '5-1',
                    user: false,
                    children: [{
                        name: '五级分类',
                        id: '6-1',
                        user: false,
                        children: [{
                            name: '六级分类',
                            id: '6-1',
                            user: true,
                            children: [

                            ]
                        }]
                    }, ]
                }, ]
            }, ]
        }, ],
    },
]

// function make(leval) {
// 	let treeNoneList = []
// 	for (let k = 0; k < 10; k++) {
// 		treeNoneList.push({
// 			name: `${leval}级分类`,
// 			id: guid(),
// 			user: true
// 		})
// 	}
// 	return treeNoneList
// }

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export {
    dataList
};