import { create, ReactTestRenderer } from "react-test-renderer";
import { expect } from "@jest/globals";
import { MockComponent } from "./__mocks__/Conditional.mock";
import { Conditional } from "../Conditional";

describe("utils/components/Conditional", () => {
  it("Должен отрендерить тестовый компонент с переданными props", () => {
    let testRenderer: ReactTestRenderer;
    const text = fakerStatic.name.firstName();
    const childrenText = fakerStatic.name.lastName();

    act(() => {
      testRenderer = create(
        <Conditional condition Component={MockComponent} text={text}>
          {childrenText}
        </Conditional>
      );
    });

    expect(testRenderer.root.findByType(MockComponent)).toBeDefined();
    expect(testRenderer.root.findAllByProps({ text })[1].type).toBe(MockComponent);
    expect(testRenderer.root.findByType(MockComponent).props.children).toBe(childrenText);
  });

  it("Должен отрендерить только children", () => {
    let testRenderer: ReactTestRenderer;
    const text = fakerStatic.name.firstName();
    const childrenText = fakerStatic.name.lastName();

    act(() => {
      testRenderer = create(
        <Conditional condition={false} Component={MockComponent} text={text}>
          {childrenText}
        </Conditional>
      );
    });

    expect(() => testRenderer.root.findByType(MockComponent)).toThrowError();
    expect(testRenderer.root.children[0]).toBe(childrenText);
  });
});
