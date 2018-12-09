describe("Given a stacked map", () => {
    let stackedMap;

    beforeEach(angular.mock.module("ui-lib"));
    beforeEach(inject(($$stackedMap) => {
      stackedMap = $$stackedMap.createNew();
    }));

    it("should add and remove objects by key", () => {
      stackedMap.add("foo", "foo_value");
      expect(stackedMap.length()).toEqual(1);
      expect(stackedMap.get("foo").key).toEqual("foo");
      expect(stackedMap.get("foo").value).toEqual("foo_value");
      stackedMap.remove("foo");
      expect(stackedMap.length()).toEqual(0);
      expect(stackedMap.get("foo")).toBeUndefined();
    });

    it("should support listing keys", () => {
      stackedMap.add("foo", "foo_value");
      stackedMap.add("bar", "bar_value");
      expect(stackedMap.keys()).toEqual(["foo", "bar"]);
    });

    it("should get topmost element", () => {
      stackedMap.add("foo", "foo_value");
      stackedMap.add("bar", "bar_value");
      expect(stackedMap.length()).toEqual(2);
      expect(stackedMap.top().key).toEqual("bar");
      expect(stackedMap.length()).toEqual(2);
    });

    it("should remove topmost element", () => {
      stackedMap.add("foo", "foo_value");
      stackedMap.add("bar", "bar_value");

      expect(stackedMap.removeTop().key).toEqual("bar");
      expect(stackedMap.removeTop().key).toEqual("foo");
    });

    it("should preserve semantic of an empty stackedMap", () => {
      expect(stackedMap.length()).toEqual(0);
      expect(stackedMap.top()).toBeUndefined();
    });

    it("should ignore removal of non-existing elements", () => {
      expect(stackedMap.remove("non-existing")).toBeUndefined();
    });
  });
