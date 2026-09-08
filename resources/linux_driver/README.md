# Linux 嵌入式驱动程序源码包 (Linux Drivers Archive)

本目录归档了基于 NXP i.MX6ULL 与 Linux 4.1.15 内核开发的工业级外设驱动源码，采用 7-Zip (`.7z`) 格式压缩打包。包含驱动源码文件、外设协议头文件及交叉编译 Makefile。

---

## 📦 驱动源码包清单

| 驱动分类 | 压缩包文件名 | 包含驱动源码文件 | 控制外设与通信总线 |
| :--- | :--- | :--- | :--- |
| **Linux LED 驱动** | [`linux-led-driver.7z`](./linux-led-driver.7z) | `led_gpio.c`, `Makefile` | GPIO 子系统 / Platform 平台总线 / RGB 三色 LED |
| **Linux I2C 传感器驱动** | [`linux-i2c-driver.7z`](./linux-i2c-driver.7z) | `mpu6050.c`, `dht20.c`, `i2c_drv.h`, `Makefile` | I2C 子系统 / MPU6050 六轴运动传感器 / DHT20 温湿度传感器 |
| **Linux SPI 屏幕驱动** | [`linux-spi-driver.7z`](./linux-spi-driver.7z) | `spi_lcd.c`, `spi_drv.h`, `Makefile` | SPI 子系统 / 20MHz 高速总线 / 240x240 SPI LCD 屏幕 |

---

## 🛠️ 交叉编译与构建

解压后，修改 Makefile 中的 `KERNELDIR` 指向您的开发板 Linux 内核源码目录，然后执行：

```bash
make
```

生成相应的 `.ko` 驱动模块，使用 `scp` 或 NFS 挂载拷贝至开发板运行测试。
