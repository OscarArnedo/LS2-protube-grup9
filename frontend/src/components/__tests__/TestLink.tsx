import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import TestLink from "../TestLink";

describe("this component", () => {
  it("renders correctly", () => {
    const { asFragment, getByText } = render(
      <TestLink page="http://www.facebook.com">Facebook2</TestLink>
    );
    expect(getByText("Facebook2")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
