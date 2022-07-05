import { create, ReactTestRenderer } from "react-test-renderer";
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

    expectJest(testRenderer.root.findByType(MockComponent)).toBeDefined();
    expectJest(testRenderer.root.findAllByProps({ text })[1].type).toBe(MockComponent);
    expectJest(testRenderer.root.findByType(MockComponent).props.children).toBe(childrenText);
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

    expectJest(() => testRenderer.root.findByType(MockComponent)).toThrowError();
    expectJest(testRenderer.root.children[0]).toBe(childrenText);
  });
});
