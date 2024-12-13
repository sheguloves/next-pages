# Flutter Android 中使用 WebView

在Flutter 中要使用 webview 显示 https 的内容，需要按照如下步骤设置

- 修改文件：*android/app/src/main/AndroidManifest.xml*, 添加 **android:usesCleartextTraffic="true"**，同时设置网络权限：**<uses-permission android:name="android.permission.INTERNET"/>**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    android:usesCleartextTraffic="true">
    <uses-permission android:name="android.permission.INTERNET"/>
    ... ...
</manifest>
```

- 添加文件 *android/app/src/main/src/xml/network_security_config.xml*, 文件内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <!-- 信任系统预装 CA 证书 -->
            <certificates src="system" />
            <!-- 信任用户添加的 CA 证书，Charles 和 Fiddler 抓包工具安装的证书属于此类 -->
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

- 修改文件：*android/app/src/main/AndroidManifest.xml*, 将 **android:networkSecurityConfig="@xml/network_security_config"** 添加在 **application** 标签中.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    android:usesCleartextTraffic="true">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application
        android:networkSecurityConfig="@xml/network_security_config"
        android:label="lagrange_app"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        ... ...
    </application>
</manifest>
```

如果还存在其他的错误，可以根据[Flutter Android 发送网络请求](./flutter_android_remote_request-2024-12-13.md) 中描述的解决网络请求报错的方式尝试解决问题。