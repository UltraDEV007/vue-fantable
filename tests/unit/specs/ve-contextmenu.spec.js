import { mount, createWrapper } from "@vue/test-utils";
import veContextmenu from "@/ve-contextmenu";
import {
    later,
    mockElementMeasurement,
    clearMockElementMeasurement,
} from "../util";

describe("veContextmenu", () => {
    const OPTIONS = [
        {
            label: "menu1",
            type: "menu1-type",
        },
        {
            label: "menu2",
            type: "menu2-type",
            children: [
                {
                    label: "menu2-1",
                    type: "menu2-1-type",
                },
                {
                    label: "menu2-2",
                    type: "menu2-2",
                },
            ],
        },
        {
            type: "SEPARATOR",
        },
        {
            label: "menu3",
            type: "menu3-type",
        },
        {
            label: "menu4",
            disabled: true,
            children: [
                {
                    label: "menu4-1",
                },
            ],
        },
        {
            label: "menu5",
            type: "menu5-type",
            children: [
                {
                    label: "menu5-1",
                    type: "menu5-1-type",
                    children: [
                        {
                            label: "menu5-1-1",
                        },
                        {
                            label: "menu5-2-2",
                            type: "menu5-2-2-type",
                        },
                    ],
                },
                {
                    label: "menu5-2",
                    disabled: true,
                },
                {
                    type: "SEPARATOR",
                },
                {
                    label: "menu5-3",
                    type: "menu5-3-type",
                },
            ],
        },
        {
            label: "menu6",
            type: "menu6-type",
            disabled: true,
        },
    ];

    beforeEach(() => {
        return new Promise((resolve) => {
            let containerEl = document.createElement("div");
            containerEl.setAttribute("id", "contextmenu-target");
            document.body.appendChild(containerEl);

            resolve();
        });
    });

    afterEach(() => {
        return new Promise((resolve) => {
            const containerEl = document.querySelector("#contextmenu-target");
            containerEl.remove();

            resolve();
        });
    });

    it("render", () => {
        const wrapper = mount({
            template: `
            <div>
                <div id="contextmenu-target">Right click this area</div>
                <ve-contextmenu eventTarget="#contextmenu-target" :options="options" />
            </div>`,
            data() {
                return {
                    options: OPTIONS,
                };
            },
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.destroy();
    });

    it("contextmenu event", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <ve-contextmenu
                                eventTarget={document.querySelector(
                                    "#contextmenu-target",
                                )}
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event);

        await later();

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(1);

        wrapper.destroy();
    });

    it("contextmenu async contextmenu option", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <ve-contextmenu
                                eventTarget={document.querySelector(
                                    "#contextmenu-target",
                                )}
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: [],
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event);

        await later();

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(0);

        wrapper.vm.options = OPTIONS;

        await later();

        contextmenuTargetEl.dispatchEvent(event);

        await later();

        const contextmenuPoppers2 = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers2.length).toBe(1);

        wrapper.destroy();
    });

    it("contextmenu eventTarget", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <ve-contextmenu
                                eventTarget={document.querySelector(
                                    "#contextmenu-target",
                                )}
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event);

        await later();

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(1);

        wrapper.destroy();
    });

    it("contextmenu node hover", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <ve-contextmenu
                                eventTarget={document.querySelector(
                                    "#contextmenu-target",
                                )}
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        await later();

        const contextmenuPopper = document.querySelector(
            ".ve-contextmenu-popper",
        );

        const contextmenuNodes = contextmenuPopper.querySelectorAll(
            ".ve-contextmenu-node",
        );

        //trigger element hover
        const event2 = new MouseEvent("mouseover", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuNodes[1].dispatchEvent(event2);

        await later(500);

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(2);

        await later();

        // remove panel by hover or click parent node
        const event3 = new MouseEvent("click", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });
        contextmenuNodes[0].dispatchEvent(event3);

        await later(500);

        const contextmenuPoppers2 = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers2[1].innerHTML).toBe("");

        wrapper.destroy();
    });

    it("contextmenu on-node-click event", async () => {
        const mockFn = jest.fn();

        const wrapper = mount(
            {
                template: `
            <div>
                <div id="contextmenu-target">Right click this area</div>
                <ve-contextmenu @on-node-click="contextmenuClick" eventTarget="#contextmenu-target" :options="options" />
            </div>`,
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
                methods: {
                    contextmenuClick(param) {
                        mockFn(param);
                    },
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        await later();

        const contextmenuPopper = document.querySelector(
            ".ve-contextmenu-popper",
        );

        const contextmenuNodes = contextmenuPopper.querySelectorAll(
            ".ve-contextmenu-node",
        );

        const event2 = new MouseEvent("click", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuNodes[0].dispatchEvent(event2);

        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith("menu1-type");

        wrapper.destroy();
    });

    it("contextmenu panel child node click", async () => {
        const mockFn = jest.fn();

        const wrapper = mount(
            {
                template: `
            <div>
                <div id="contextmenu-target">Right click this area</div>
                <ve-contextmenu @on-node-click="contextmenuClick" eventTarget="#contextmenu-target" :options="options" />
            </div>`,
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
                methods: {
                    contextmenuClick(param) {
                        mockFn(param);
                    },
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        await later();

        const contextmenuPopper = document.querySelector(
            ".ve-contextmenu-popper",
        );

        const contextmenuNodes = contextmenuPopper.querySelectorAll(
            ".ve-contextmenu-node",
        );

        //trigger element hover
        const event2 = new MouseEvent("mouseover", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuNodes[1].dispatchEvent(event2);

        await later(500);

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );

        const childPanel = contextmenuPoppers[1];

        const clickEvent = new MouseEvent("click", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        const childContextmenuNodes = childPanel.querySelectorAll(
            ".ve-contextmenu-node",
        );

        childContextmenuNodes[0].dispatchEvent(clickEvent);

        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith("menu2-1-type");

        wrapper.destroy();
    });

    it("contextmenu node disabled", async () => {
        const mockFn = jest.fn();

        const wrapper = mount(
            {
                template: `
            <div>
                <div id="contextmenu-target">Right click this area</div>
                <ve-contextmenu @on-node-click="contextmenuClick" eventTarget="#contextmenu-target" :options="options" />
            </div>`,
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
                methods: {
                    contextmenuClick(param) {
                        mockFn(param);
                    },
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        await later();

        const contextmenuPopper = document.querySelector(
            ".ve-contextmenu-popper",
        );

        const contextmenuNodes = contextmenuPopper.querySelectorAll(
            ".ve-contextmenu-node",
        );

        const event = new MouseEvent("click", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuNodes[5].dispatchEvent(event);

        expect(mockFn).toHaveBeenCalledTimes(0);

        wrapper.destroy();
    });

    it("contextmenu destoryed", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <div id="contextmenu-target">
                                Right click this area
                            </div>
                            <ve-contextmenu
                                eventTarget="#contextmenu-target"
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        await later();

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(1);

        wrapper.destroy();

        const contextmenuPoppers2 = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers2.length).toBe(0);
    });

    /* 
    panel 左侧展示
    */
    it("contextmenu panel left direction", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <div id="contextmenu-target">
                                Right click this area
                            </div>
                            <ve-contextmenu
                                eventTarget="#contextmenu-target"
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const veContextmenuComp = wrapper.findComponent(veContextmenu);

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        veContextmenuComp.setData({
            isPanelRightDirection: false,
        });

        await later();

        const contextmenuPopper = document.querySelector(
            ".ve-contextmenu-popper",
        );

        const contextmenuNodes = contextmenuPopper.querySelectorAll(
            ".ve-contextmenu-node",
        );

        //trigger element hover
        const event = new MouseEvent("mouseover", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuNodes[1].dispatchEvent(event);

        await later(500);

        const contextmenuPoppers = document.querySelectorAll(
            ".ve-contextmenu-popper",
        );
        expect(contextmenuPoppers.length).toBe(2);

        wrapper.destroy();
    });

    it("contextmenu clickoutside", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <button id="outsideButton">outside table</button>
                            <div
                                id="contextmenu-target"
                                style="width:300px;height:300px;"
                            >
                                Right click this area
                            </div>
                            <ve-contextmenu
                                eventTarget="#contextmenu-target"
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        const veContextmenuComp = wrapper.findComponent(veContextmenu);

        expect(veContextmenuComp.vm.isPanelsEmptyed).toBe(false);

        // click outside
        wrapper.find("#outsideButton").trigger("click");

        await later();

        expect(veContextmenuComp.vm.isPanelsEmptyed).toBe(true);

        wrapper.destroy();
    });

    it("hideContextmenu instance method", async () => {
        const wrapper = mount(
            {
                render() {
                    return (
                        <div>
                            <button id="outsideButton">outside table</button>
                            <div
                                id="contextmenu-target"
                                style="width:300px;height:300px;"
                            >
                                Right click this area
                            </div>
                            <ve-contextmenu
                                eventTarget="#contextmenu-target"
                                options={this.options}
                            />
                        </div>
                    );
                },
                data() {
                    return {
                        options: OPTIONS,
                    };
                },
            },
            // need attach to documnet
            { attachTo: document.body },
        );

        const contextmenuTargetEl = document.querySelector(
            "#contextmenu-target",
        );

        //trigger element hover
        const event1 = new MouseEvent("contextmenu", {
            view: window, // window
            bubbles: true,
            cancelable: true,
        });

        contextmenuTargetEl.dispatchEvent(event1);

        const veContextmenuComp = wrapper.findComponent(veContextmenu);

        expect(veContextmenuComp.vm.isPanelsEmptyed).toBe(false);

        veContextmenuComp.vm.hideContextmenu();

        // click outside
        //wrapper.find("#outsideButton").trigger("click");

        await later();

        expect(veContextmenuComp.vm.isPanelsEmptyed).toBe(true);

        wrapper.destroy();
    });
});
