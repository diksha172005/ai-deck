package com.aideckapp.config;

import com.aideckapp.model.Category;
import com.aideckapp.model.Tool;
import com.aideckapp.repository.CategoryRepository;
import com.aideckapp.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ToolRepository toolRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) return; // skip if already seeded

        // Seed categories
        Category chatbot = save(new Category(null, "Chatbot", "💬", null));
        Category imageGen = save(new Category(null, "Image Generation", "🎨", null));
        Category coding = save(new Category(null, "Coding", "💻", null));
        Category video = save(new Category(null, "Video", "🎬", null));
        Category productivity = save(new Category(null, "Productivity", "⚡", null));
        Category writing = save(new Category(null, "Writing", "✍️", null));
        Category audio = save(new Category(null, "Audio", "🎵", null));

        // Seed tools
        toolRepository.saveAll(List.of(
            tool("ChatGPT", "The world's most popular AI chatbot by OpenAI.", "https://chat.openai.com", "🤖", List.of("chatbot", "gpt", "openai"), chatbot, true),
            tool("Claude", "Anthropic's AI assistant focused on safety and helpfulness.", "https://claude.ai", "🧠", List.of("chatbot", "anthropic", "ai"), chatbot, true),
            tool("Gemini", "Google's multimodal AI assistant.", "https://gemini.google.com", "✨", List.of("chatbot", "google", "multimodal"), chatbot, false),
            tool("Perplexity", "AI-powered search engine that answers questions with sources.", "https://perplexity.ai", "🔍", List.of("search", "chatbot", "research"), chatbot, false),

            tool("Midjourney", "Create stunning images from text prompts via Discord.", "https://midjourney.com", "🎨", List.of("image", "art", "midjourney"), imageGen, true),
            tool("DALL·E 3", "OpenAI's image generation model integrated in ChatGPT.", "https://openai.com/dall-e-3", "🖼️", List.of("image", "openai", "dalle"), imageGen, true),
            tool("Stable Diffusion", "Open-source text-to-image model you can run locally.", "https://stability.ai", "🌀", List.of("image", "open-source", "diffusion"), imageGen, false),
            tool("Adobe Firefly", "Adobe's AI image generation suite built for creatives.", "https://firefly.adobe.com", "🔥", List.of("image", "adobe", "design"), imageGen, false),

            tool("GitHub Copilot", "AI pair programmer that suggests code in your editor.", "https://github.com/features/copilot", "🐙", List.of("coding", "github", "autocomplete"), coding, true),
            tool("Cursor", "AI-first code editor built on VS Code.", "https://cursor.sh", "⌨️", List.of("coding", "editor", "vscode"), coding, true),
            tool("Tabnine", "AI code completion for all major IDEs.", "https://tabnine.com", "🔮", List.of("coding", "autocomplete", "ide"), coding, false),
            tool("Replit AI", "Build and deploy apps with AI assistance in the browser.", "https://replit.com", "🔁", List.of("coding", "cloud", "deploy"), coding, false),

            tool("Runway", "AI video generation and editing platform.", "https://runwayml.com", "🎥", List.of("video", "generation", "editing"), video, true),
            tool("Sora", "OpenAI's text-to-video model for realistic clips.", "https://openai.com/sora", "🎞️", List.of("video", "openai", "text-to-video"), video, true),
            tool("HeyGen", "Create AI avatar videos and voice clones.", "https://heygen.com", "🗣️", List.of("video", "avatar", "voice"), video, false),

            tool("Notion AI", "AI writing and summarization built into Notion.", "https://notion.so/product/ai", "📝", List.of("productivity", "notes", "writing"), productivity, true),
            tool("Otter.ai", "AI meeting transcription and notes.", "https://otter.ai", "🦦", List.of("productivity", "transcription", "meetings"), productivity, false),
            tool("Motion", "AI-powered calendar and task planner.", "https://usemotion.com", "📅", List.of("productivity", "calendar", "planning"), productivity, false),

            tool("Jasper", "AI writing platform for marketing and content teams.", "https://jasper.ai", "🖊️", List.of("writing", "marketing", "content"), writing, true),
            tool("Copy.ai", "Generate marketing copy, emails, and social posts with AI.", "https://copy.ai", "📋", List.of("writing", "copywriting", "marketing"), writing, false),
            tool("Grammarly", "AI writing assistant for grammar and style improvements.", "https://grammarly.com", "✅", List.of("writing", "grammar", "editing"), writing, true),

            tool("ElevenLabs", "Clone voices and generate ultra-realistic speech with AI.", "https://elevenlabs.io", "🔊", List.of("audio", "voice", "tts"), audio, true),
            tool("Suno", "Generate full songs with lyrics and music from a text prompt.", "https://suno.ai", "🎤", List.of("audio", "music", "generation"), audio, true),
            tool("Udio", "Create studio-quality music with AI in seconds.", "https://udio.com", "🎶", List.of("audio", "music", "generation"), audio, false)
        ));

        System.out.println("✅ Database seeded with categories and tools.");
    }

    private Category save(Category c) {
        return categoryRepository.save(c);
    }

    private Tool tool(String name, String desc, String link, String logo,
                      List<String> tags, Category cat, boolean featured) {
        Tool t = new Tool();
        t.setName(name);
        t.setDescription(desc);
        t.setLink(link);
        t.setLogoUrl(logo);
        t.setTags(tags);
        t.setCategory(cat);
        t.setFeatured(featured);
        return t;
    }
}
