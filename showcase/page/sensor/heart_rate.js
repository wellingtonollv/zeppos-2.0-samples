import { createWidget, widget, prop, event, align, text_style } from "@zos/ui";
import { HeartRate } from "@zos/sensor";
import { log as Logger, px } from "@zos/utils";
import PageAdvanced from "../../utils/template/PageAdvanced";
import log from "../../utils/log";
import { pauseDropWristScreenOff } from '@zos/display';

const logger = Logger.getLogger("heart_rate");
const { messageBuilder } = getApp()._options.globalData;

pauseDropWristScreenOff({
  duration: 0,
})

PageAdvanced({
  state: {
    pageName: "HeartRate",
  },
  build() {
    const heartRate = new HeartRate();

    const text = createWidget(widget.TEXT, {
      x: px(0),
      y: px(120),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `CURRENT: ${heartRate.getCurrent()}; LAST: ${heartRate.getLast()}`,
    });

    text.addEventListener(event.CLICK_DOWN, (info) => {
      text.setProperty(prop.MORE, {
        text: `CURRENT: ${heartRate.getCurrent()}; LAST: ${heartRate.getLast()}`,
      });
    });

    const currentText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(180),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `EVENT-CURRENT: `,
    });

    const lastText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(240),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `EVENT-LAST: `,
    });

    const currCallback = () => {
      const current = heartRate.getCurrent();
      currentText.setProperty(prop.MORE, {
        text: `EVENT-CURRENT: ${current}`,
      });
      this.sendData(current);
    };

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(300),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: "REGISTER_CURRENT",
      click_func: () => {
        heartRate.onCurrentChange(currCallback);
      },
    });

    const lastCallback = () => {
      lastText.setProperty(prop.MORE, {
        text: `EVENT-LAST: ${heartRate.getLast()}`,
      });
    };

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(380),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: "REGISTER_LAST",
      click_func: () => {
        // heartRate.onLastChange(lastCallback)
        this.sendData(heartRate.getLast());
      },
    });
  },
  sendData(currentHeartRate) {
    messageBuilder.request({
      method: "HEART_RATE",
      params: {
        currentHeartRate,
      },
    });
  },
});
