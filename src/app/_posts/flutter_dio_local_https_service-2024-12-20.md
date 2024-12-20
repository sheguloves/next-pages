# Flutter 连接本地 Https 服务器证书问题

在开发 Flutter 应用的时候，使用 **Dio** 连接本地 **HTTPS** 服务会报证书错误问题

```shell
DioError ║ DioErrorType.DEFAULT
I/flutter ( 8182): ║ HandshakeException: Handshake error in client (OS Error:
I/flutter ( 8182): CERTIFICATE_VERIFY_FAILED: unable to get local issuer certificate(handshake.cc:354))
```

解决办法如下:

- 下载证书文件 [lets-encrypt-r3.pem](/assets/ca/lets-encrypt-r3.pem "download-lets-encrypt-r3.pem")
- 将下载的文件放在 Flutter 项目路径 **assets/ca/** 下
- 将资源目录 **assets/ca/** 配置在 **pubspec.yaml** 中
- 添加下面的代码到 **lib/main.dart** 中

```dart
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';

class MyHttpoverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}

void initCA() async {
  WidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = MyHttpoverrides();
  ByteData data = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(data.buffer.asUint8List());
}

void main() {
  initCA();
  runApp(const MyApp());
}

```
