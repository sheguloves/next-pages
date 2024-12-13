# Flutter Android 发送网络请求

- 添加 **Android** 网络权限，文件路径：*android/app/src/main/AndroidManifest.xml*

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    android:usesCleartextTraffic="true">
    <uses-permission android:name="android.permission.INTERNET"/>
    <!--
    <application
        android:networkSecurityConfig="@xml/network_security_config"
        ... ...
    </application>
    -->
</manifest>

```
- 安装 **dio** 包，通过 **dio** 发送网络请求。如果发现 **android** 模拟器报错下面的错误，检查模拟的 **wifi** ，关闭**wifi**.
```
Error: SocketException: Connection refused (OS Error: Connection refused, errno = 111)
```
![flutter-wifi.png](flutter-wifi.png)

