import { allure } from 'allure-mocha/runtime';
import CoreApi from '../http/CoreApi';
import { assert } from 'chai';
import { AxiosResponse } from 'axios';
import { Cat, CatsList } from '../../@types/common';
import LikeApi from "../http/LikeApi";

export default class Steps {
  public static common = {
    stepGetCatById: Steps.getCatById,
    equal: Steps.equal,
    allByLetter: Steps.allByLetter,
    searchCatByPartName: Steps.searchCatByPartName,
    removeCat: Steps.removeCat,
    likes: Steps.likes,
    likesOnlyLike: Steps.likesOnlyLike,
    likesOnlyDislike: Steps.likesOnlyDislike
  };
  private static async getCatById(id: number): Promise<AxiosResponse<{ cat: Cat }>> {
    return await allure.step(`выполнен запрос GET /get-by-id c параметром ${id}`, async () => {
      console.info('тест 2 🚀:', 'выполняется запрос GET /get-by-id');
      const response = await CoreApi.getCatById(id);
      const data = JSON.stringify(response.data, null, 2);
      console.info('тест 2 🚀:', 'получен ответ на запрос GET /get-by-id:\n', data);
      allure.attachment('attachment', data, 'application/json');
      console.info('тест 2 🚀:', 'получен ответ на запрос GET /get-by-id:\n', response.data);
      return response;
    });
  }

  private static async equal(exp: any, act: any) {
    return await allure.step('выполнена проверка соответствия значений', () => {
      allure.attachment('expected', exp, 'text/plain');
      allure.attachment('actual', act, 'text/plain');
      assert.equal(exp, act, 'Значения не соответствуют');
    });
  }

  private static async allByLetter(limit: number = 10): Promise<AxiosResponse<{
    groups: { title: string; cats: Cat[]; count_in_group: number; count_by_letter: number } [];
    count_output: number;
    count_all: number }>> {
    return await allure.step(`Выполнен запрос GET /allByLetter`, async () => {
      console.info('Поиск сгруппированных котов:', 'выполняется запрос GET /allByLetter');
      const response = await CoreApi.allByLetter();
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /allByLetter', data, 'application/json');
      console.info('Поиск сгруппированных котов:', 'получен ответ на запрос GET /allByLetter:\n', response.data);
      return response;
    });
  }

  private static async searchCatByPartName(name: string, limit: number, offset: number): Promise<AxiosResponse<CatsList>> {
    return await allure.step(`Выполнен запрос GET /search-pattern с параметрами name=${name}, limit=${limit}, offset=${offset}`, async () => {
      console.info('Поиск случайного кота:', 'выполняется запрос GET /search-pattern с параметрами name='+name+', limit='+limit+', offset='+offset);
      const response = await CoreApi.searchCatByPartName(name, limit, offset);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /search-pattern', data, 'application/json');
      console.info('Поиск случайного кота:', 'получен ответ на запрос GET /search-pattern:\n', response.data);
      return response;
    });
  }

  private static async removeCat(id: number): Promise<AxiosResponse<Cat>> {
    return await allure.step(`Удалить найденного случайного котика`, async () => {
      console.info('Удалить найденного случайного котика:', 'выполняется запрос DELETE /remove с параметром id=', id);
      const response = await CoreApi.removeCat(id);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /remove', data, 'application/json');
      console.info('Удалить найденного случайного котика:', 'получен ответ на запрос DELETE /remove:\n', response.data);
      return response;
    });
  }

  private static async likes(id: number, voice: { like: boolean; dislike: boolean }): Promise<AxiosResponse<Cat>> {
    return await allure.step(`Выполнен запрос POST /likes c параметром id=${id}, like=${voice.like}, dislike=${voice.dislike}`, async () => {
      console.info('Поставить лайк котику:', 'выполняется запрос POST /likes с параметром id='+id+', like='+voice.like+' dislike='+voice.dislike);
      const response = await LikeApi.likes(id, voice);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /likes', data, 'application/json');
      console.info('Поставить лайк котику:', 'получен ответ на запрос POST /likes:\n', response.data);
      return response;
    });
  }

  private static async likesOnlyLike(id: number, voice: { like: boolean}): Promise<AxiosResponse<Cat>> {
    return await allure.step(`Выполнен запрос POST /likes c параметром id=${id}, like=${voice.like}`, async () => {
      console.info('Поставить лайк котику:', 'выполняется запрос POST /likes с параметром id='+id+', like='+voice.like);
      const response = await LikeApi.likesOnlyLike(id, voice);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /likes', data, 'application/json');
      console.info('Поставить лайк котику:', 'получен ответ на запрос POST /likes:\n', response.data);
      return response;
    });
  }

  private static async likesOnlyDislike(id: number, voice: { dislike: boolean}): Promise<AxiosResponse<Cat>> {
    return await allure.step(`Выполнен запрос POST /likes c параметром id=${id}, dislike=${voice.dislike}`, async () => {
      console.info('Поставить дизлайк котику:', 'выполняется запрос POST /likes с параметром id='+id+', dislike='+voice.dislike);
      const response = await LikeApi.likesOnlyDislike(id, voice);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('response /likes', data, 'application/json');
      console.info('Поставить дизлайк котику:', 'получен ответ на запрос POST /likes:\n', response.data);
      return response;
    });
  }
}