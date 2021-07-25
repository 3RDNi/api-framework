import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';

describe('Проверка поиска и удаления случайного кота', async () => {
    let randomCatId: number;
    let randomTitle: string;
    let randomOffset: number;

    //Для поиска случайного котика используем метод /cats/search-pattern, где параметры
    //name и offset будут выбраны случайным образом из ответа метода /cats/allByLetter

    it('Найти случайного кота', async () => {
        allure.link(
            'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/Поиск/get_cats_allByLetter',
            'allByLetter'
        );
        allure.link(
            'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/Поиск/get_cats_search_pattern',
            'search-pattern'
        );
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        const response = await Steps.common.allByLetter(1);

        await allure.step(
            'Получаем случайные значения параметров name и offset для метода search-pattern',
            async () => {

                //Создаем массив из заголовков групп
                const titleArray = [];
                const groupsArray = response.data.groups
                for (let i = 0; i < groupsArray.length; i++) {
                    titleArray.push(groupsArray[i].title);
                }
                //Получаем случайный заголовок
                const getRandomInt = (max: number) => Math.floor(Math.random() * (max + 1));
                const randomIndexOfTitle = getRandomInt(groupsArray.length);
                randomTitle = titleArray[randomIndexOfTitle];

                //Получаем случайный номер/смещение в группе (например, если в группе 'А' - 10 котиков, то random[0,10])
                randomOffset = groupsArray[randomIndexOfTitle].count_by_letter - 1

                allure.attachment('Параметр name:', randomTitle, 'text/plain');
                allure.attachment('Параметр offset: ', randomOffset.toString(), 'text/plain');

                console.info('Получаем случайные значения параметров name и offset для метода search-pattern:', randomTitle, randomOffset);
            });
        await allure.step(
            'Получение случайного котика',
            async () => {
                const response = await Steps.common.searchCatByPartName(randomTitle, 1, randomOffset);
                randomCatId = response.data.cats[0].id
            });
    });

    it('Удалить найденного котика', async () => {
        allure.link(
            'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/Удаление/delete_cats__catId__remove',
            'remove'
        );
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        const response = await Steps.common.removeCat(randomCatId)
        if (response.status === 404) {
            assert.fail(`Кот не найден! Response:\n ${JSON.stringify(response.data, null, 2)}`);
        }
        if (response.status === 400) {
            assert.fail(`Неверный формат ID! Response:\n ${JSON.stringify(response.data, null, 2)}`);
        }
        assert.equal(response.data.id, randomCatId, 'ID не соответствуют');
    });

    it('Проверка статуса ответа после удаления найденного кота', async () => {
        allure.link(
            'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/Удаление/delete_cats__catId__remove',
            'remove'
        );
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        const status: number = 404;
        const response = await Steps.common.removeCat(randomCatId)
        assert.ok(
            response.status === status,
            `Актуальный статус код ${response.status}, ожидался ${status}`
        );
    });
});
