package cc.whyy0u.demo.utils;

public class TextUtils {
    public static String cleanText(String text) {
        text = text.replaceAll("\\r\\n|\\n|\\r", " ");
        text = text.replaceAll("[^a-zA-Zа-яА-Я0-9\\s]", "");
        text = text.replaceAll("\\s+", " ").trim();
        return text;
    }
}
