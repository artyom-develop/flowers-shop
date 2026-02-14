import {ActiveParamsUtil} from "./active-params.util";

describe("active params util", () => {

  it('должен вернуть масив если в types передана строка', () => {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkelenti'
    });

    expect(result.types).toBeInstanceOf(Array);
  });

  it('должен вренуть число если передали строку в виде числа', () => {
    const result = ActiveParamsUtil.processParams({
      page: '2'
    });

    expect(result.page).toBe(2);
  });
  it('должен вренуть число если передали строку в виде числа', () => {
    const result: any = ActiveParamsUtil.processParams({
      pages: '2'
    });
    expect(result.pages).toBe(undefined);
  });
  it('должен вернуть массив со всеми доступными полями ActiveParamsType в правильном виде', () => {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkelenti',
      id: "21",
      heightFrom: '2',
      heightTo: '2',
      diameterFrom:'2',
      diameterTo:'2',
      sort: '2',
      page: "2",
    });

    expect(result).toEqual({
      types: ['sukkelenti'],
      heightFrom: '2',
      heightTo: '2',
      diameterFrom:'2',
      diameterTo:'2',
      sort: '2',
      page: 2,
    });
  });
});
