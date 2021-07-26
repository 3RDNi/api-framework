import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';
import {Cat} from "../@types/common";
import LikeApi from "../src/http/LikeApi";

describe('Проверка лайков случайного котика', async () => {
    let randomCat: Cat;
    let randomTitle: string;
    let randomOffset: number;
    let likesCat: number;
    let likesCatExpected: number;
    let likesCatActual: number;
    let n: number = 5;

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
                randomCat = response.data.cats[0]
            });
    });

    it('Получить и сохранить количество лайков котика', async () => {
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        likesCat = randomCat.likes
        allure.attachment('Количество лайков у котика:', likesCat.toString(), 'text/plain');
        console.info('Количество лайков у котика:', likesCat);
    });

    it('Поставить n лайков котику', async () => {
        allure.link(
            'https://meowle.qa-fintech.ru/api/likes/api-docs-ui/#/%D0%9B%D0%B0%D0%B9%D0%BA%2F%D0%94%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA/post_cats__catId__likes',
            'likes'
        );
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        await allure.step(
            'Запрос POST /likes выполнен '+n+' раз',
            async () => {
                for (let i = 0; i < n; i++) {
                    var response = await Steps.common.likesOnlyLike(randomCat.id, {like: true});
                }
                likesCatActual = response.data.likes
            }
        );
    });

    it('Проверка, что количество лайков котика соответсвует ожидаемому', async () => {
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        likesCatExpected = likesCat + n

        console.info('Выполнена проверка соответствия значения лайков кота из запроса с ожидаемым:\n', likesCatActual, likesCatExpected);
        await allure.step(
            'выполнена проверка соответствия значения лайков кота из запроса с ожидаемым',
            async () => await Steps.common.equal(likesCatActual, likesCatExpected)
        );
    });

    after(async () => {
        await allure.step(
            'Удаляем '+n+' лайков после тестов',
            async () => {
                console.log('Удаляем '+n+' лайков после тестов')
                for (let i = 0; i < n; i++) {
                    var response = await LikeApi.likesOnlyLike(randomCat.id, {like: false})
                    likesCatActual = response.data.likes
                }
                console.info('Выполнена проверка соответствия значения лайков кота из запроса с ожидаемым:\n', likesCatActual, randomCat.likes);
                await allure.step(
                    'выполнена проверка соответствия значения лайков кота из запроса с ожидаемым',
                    async () => await Steps.common.equal(likesCatActual, randomCat.likes)
                );
            }
        );
    });
});

describe('Проверка дизлайков случайного котика', async () => {
    let randomCat: Cat;
    let randomTitle: string;
    let randomOffset: number;
    let dislikesCat: number;
    let dislikesCatExpected: number;
    let dislikesCatActual: number;
    let m: number = 5;

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
                randomCat = response.data.cats[0]
            });
    });

    it('Получить и сохранить количество дизлайков котика', async () => {
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        dislikesCat = randomCat.dislikes
        allure.attachment('Количество дизлайков у котика:', dislikesCat.toString(), 'text/plain');
        console.info('Количество дизлайков у котика:', dislikesCat);
    });

    it('Поставить m дизлайков котику', async () => {
        allure.link(
            'https://meowle.qa-fintech.ru/api/likes/api-docs-ui/#/%D0%9B%D0%B0%D0%B9%D0%BA%2F%D0%94%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA/post_cats__catId__likes',
            'dislikes'
        );
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        await allure.step(
            'Запрос POST /likes выполнен '+m+' раз',
            async () => {
                for (let i = 0; i < m; i++) {
                    var response = await Steps.common.likesOnlyDislike(randomCat.id, {dislike: true});
                }
                dislikesCatActual = response.data.dislikes
            }
        );
    });

    it('Проверка, что количество дизлайков котика соответсвует ожидаемому', async () => {
        allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

        dislikesCatExpected = dislikesCat + m

        console.info('Выполнена проверка соответствия значения дизлайков кота из запроса с ожидаемым:\n', dislikesCatActual, dislikesCatExpected);
        await allure.step(
            'выполнена проверка соответствия значения дизлайков кота из запроса с ожидаемым',
            async () => await Steps.common.equal(dislikesCatActual, dislikesCatExpected)
        );
    });

    after(async () => {
        await allure.step(
            'Удаляем '+m+' дизлайков после тестов',
            async () => {
                console.log('Удаляем '+m+' дизлайков после тестов')
                for (let i = 0; i < m; i++) {
                    var response = await LikeApi.likesOnlyDislike(randomCat.id, {dislike: false})
                    dislikesCatActual = response.data.dislikes
                }
                console.info('Выполнена проверка соответствия значения дизлайков кота из запроса с ожидаемым:\n', dislikesCatActual, randomCat.dislikes);
                await allure.step(
                    'выполнена проверка соответствия значения дизлайков кота из запроса с ожидаемым',
                    async () => await Steps.common.equal(dislikesCatActual, randomCat.dislikes)
                );
            }
        );
    });
});

