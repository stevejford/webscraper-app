├── .github
    ├── ISSUE_TEMPLATE
    │   ├── bug_report.yml
    │   ├── config.yml
    │   ├── documentation_issue.yml
    │   └── feature_request.yml
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows
    │   ├── cd.yml
    │   └── ci.yml
├── .gitignore
├── .pre-commit-config.yaml
├── CONTRIBUTING.md
├── LICENSE
├── Makefile
├── README.md
├── cookbooks
    ├── customer-support-chatbot.ipynb
    ├── helper
    │   ├── __init__.py
    │   └── mem0_teachability.py
    └── mem0-autogen.ipynb
├── docs
    ├── README.md
    ├── _snippets
    │   ├── get-help.mdx
    │   └── paper-release.mdx
    ├── api-reference.mdx
    ├── api-reference
    │   ├── entities
    │   │   ├── delete-user.mdx
    │   │   └── get-users.mdx
    │   ├── memory
    │   │   ├── add-memories.mdx
    │   │   ├── batch-delete.mdx
    │   │   ├── batch-update.mdx
    │   │   ├── create-memory-export.mdx
    │   │   ├── delete-memories.mdx
    │   │   ├── delete-memory.mdx
    │   │   ├── feedback.mdx
    │   │   ├── get-memory-export.mdx
    │   │   ├── get-memory.mdx
    │   │   ├── history-memory.mdx
    │   │   ├── update-memory.mdx
    │   │   ├── v1-get-memories.mdx
    │   │   ├── v1-search-memories.mdx
    │   │   ├── v2-get-memories.mdx
    │   │   └── v2-search-memories.mdx
    │   ├── organization
    │   │   ├── add-org-member.mdx
    │   │   ├── create-org.mdx
    │   │   ├── delete-org-member.mdx
    │   │   ├── delete-org.mdx
    │   │   ├── get-org-members.mdx
    │   │   ├── get-org.mdx
    │   │   ├── get-orgs.mdx
    │   │   └── update-org-member.mdx
    │   ├── project
    │   │   ├── add-project-member.mdx
    │   │   ├── create-project.mdx
    │   │   ├── delete-project-member.mdx
    │   │   ├── delete-project.mdx
    │   │   ├── get-project-members.mdx
    │   │   ├── get-project.mdx
    │   │   ├── get-projects.mdx
    │   │   ├── update-project-member.mdx
    │   │   └── update-project.mdx
    │   └── webhook
    │   │   ├── create-webhook.mdx
    │   │   ├── delete-webhook.mdx
    │   │   ├── get-webhook.mdx
    │   │   └── update-webhook.mdx
    ├── changelog.mdx
    ├── components
    │   ├── embedders
    │   │   ├── config.mdx
    │   │   ├── models
    │   │   │   ├── aws_bedrock.mdx
    │   │   │   ├── azure_openai.mdx
    │   │   │   ├── gemini.mdx
    │   │   │   ├── huggingface.mdx
    │   │   │   ├── langchain.mdx
    │   │   │   ├── lmstudio.mdx
    │   │   │   ├── ollama.mdx
    │   │   │   ├── openai.mdx
    │   │   │   ├── together.mdx
    │   │   │   └── vertexai.mdx
    │   │   └── overview.mdx
    │   ├── llms
    │   │   ├── config.mdx
    │   │   ├── models
    │   │   │   ├── anthropic.mdx
    │   │   │   ├── aws_bedrock.mdx
    │   │   │   ├── azure_openai.mdx
    │   │   │   ├── deepseek.mdx
    │   │   │   ├── gemini.mdx
    │   │   │   ├── google_AI.mdx
    │   │   │   ├── groq.mdx
    │   │   │   ├── langchain.mdx
    │   │   │   ├── litellm.mdx
    │   │   │   ├── lmstudio.mdx
    │   │   │   ├── mistral_AI.mdx
    │   │   │   ├── ollama.mdx
    │   │   │   ├── openai.mdx
    │   │   │   ├── sarvam.mdx
    │   │   │   ├── together.mdx
    │   │   │   └── xAI.mdx
    │   │   └── overview.mdx
    │   └── vectordbs
    │   │   ├── config.mdx
    │   │   ├── dbs
    │   │       ├── azure.mdx
    │   │       ├── chroma.mdx
    │   │       ├── elasticsearch.mdx
    │   │       ├── faiss.mdx
    │   │       ├── langchain.mdx
    │   │       ├── milvus.mdx
    │   │       ├── mongodb.mdx
    │   │       ├── opensearch.mdx
    │   │       ├── pgvector.mdx
    │   │       ├── pinecone.mdx
    │   │       ├── qdrant.mdx
    │   │       ├── redis.mdx
    │   │       ├── supabase.mdx
    │   │       ├── upstash-vector.mdx
    │   │       ├── vectorize.mdx
    │   │       ├── vertex_ai.mdx
    │   │       └── weaviate.mdx
    │   │   └── overview.mdx
    ├── contributing
    │   ├── development.mdx
    │   └── documentation.mdx
    ├── core-concepts
    │   ├── memory-operations.mdx
    │   └── memory-types.mdx
    ├── docs.json
    ├── examples.mdx
    ├── examples
    │   ├── ai_companion.mdx
    │   ├── ai_companion_js.mdx
    │   ├── aws_example.mdx
    │   ├── chrome-extension.mdx
    │   ├── collaborative-task-agent.mdx
    │   ├── customer-support-agent.mdx
    │   ├── document-writing.mdx
    │   ├── eliza_os.mdx
    │   ├── email_processing.mdx
    │   ├── llama-index-mem0.mdx
    │   ├── mem0-agentic-tool.mdx
    │   ├── mem0-demo.mdx
    │   ├── mem0-google-adk-healthcare-assistant.mdx
    │   ├── mem0-mastra.mdx
    │   ├── mem0-openai-voice-demo.mdx
    │   ├── mem0-with-ollama.mdx
    │   ├── multimodal-demo.mdx
    │   ├── openai-inbuilt-tools.mdx
    │   ├── personal-ai-tutor.mdx
    │   ├── personal-travel-assistant.mdx
    │   ├── personalized-deep-research.mdx
    │   └── youtube-assistant.mdx
    ├── faqs.mdx
    ├── favicon.svg
    ├── features.mdx
    ├── images
    │   ├── add_architecture.png
    │   ├── banner-sm.png
    │   ├── dify-mem0-integration.png
    │   ├── graph-platform.png
    │   ├── graph_memory
    │   │   ├── graph_example1.png
    │   │   ├── graph_example2.png
    │   │   ├── graph_example3.png
    │   │   ├── graph_example4.png
    │   │   ├── graph_example5.png
    │   │   ├── graph_example6.png
    │   │   ├── graph_example7.png
    │   │   ├── graph_example8.png
    │   │   └── graph_example9.png
    │   ├── hero-dark.svg
    │   ├── hero-light.svg
    │   ├── mem0-bg.png
    │   ├── platform
    │   │   ├── activity.png
    │   │   └── api-key.png
    │   ├── playground
    │   │   ├── pg-add-memory.png
    │   │   └── pg-retrieve-memory.png
    │   ├── rest-api-server.png
    │   └── search_architecture.png
    ├── integrations.mdx
    ├── integrations
    │   ├── agno.mdx
    │   ├── autogen.mdx
    │   ├── crewai.mdx
    │   ├── dify.mdx
    │   ├── elevenlabs.mdx
    │   ├── flowise.mdx
    │   ├── keywords.mdx
    │   ├── langchain-tools.mdx
    │   ├── langchain.mdx
    │   ├── langgraph.mdx
    │   ├── livekit.mdx
    │   ├── llama-index.mdx
    │   ├── mastra.mdx
    │   ├── mcp-server.mdx
    │   ├── multion.mdx
    │   ├── pipecat.mdx
    │   ├── raycast.mdx
    │   └── vercel-ai-sdk.mdx
    ├── knowledge-base
    │   └── introduction.mdx
    ├── llms.txt
    ├── logo
    │   ├── dark.svg
    │   ├── favicon.png
    │   └── light.svg
    ├── open-source
    │   ├── features
    │   │   ├── async-memory.mdx
    │   │   ├── custom-fact-extraction-prompt.mdx
    │   │   ├── custom-update-memory-prompt.mdx
    │   │   ├── multimodal-support.mdx
    │   │   ├── openai_compatibility.mdx
    │   │   └── rest-api.mdx
    │   ├── graph_memory
    │   │   ├── features.mdx
    │   │   └── overview.mdx
    │   ├── multimodal-support.mdx
    │   ├── node-quickstart.mdx
    │   ├── python-quickstart.mdx
    │   └── quickstart.mdx
    ├── openapi.json
    ├── openmemory
    │   ├── overview.mdx
    │   └── quickstart.mdx
    ├── overview.mdx
    ├── platform
    │   ├── features
    │   │   ├── advanced-retrieval.mdx
    │   │   ├── async-client.mdx
    │   │   ├── contextual-add.mdx
    │   │   ├── criteria-retrieval.mdx
    │   │   ├── custom-categories.mdx
    │   │   ├── custom-instructions.mdx
    │   │   ├── direct-import.mdx
    │   │   ├── expiration-date.mdx
    │   │   ├── feedback-mechanism.mdx
    │   │   ├── graph-memory.mdx
    │   │   ├── memory-export.mdx
    │   │   ├── multimodal-support.mdx
    │   │   ├── platform-overview.mdx
    │   │   ├── selective-memory.mdx
    │   │   ├── timestamp.mdx
    │   │   └── webhooks.mdx
    │   ├── overview.mdx
    │   └── quickstart.mdx
    ├── quickstart.mdx
    └── snippets
    │   └── snippet-intro.mdx
├── embedchain
    ├── CITATION.cff
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── Makefile
    ├── README.md
    ├── configs
    │   ├── anthropic.yaml
    │   ├── aws_bedrock.yaml
    │   ├── azure_openai.yaml
    │   ├── chroma.yaml
    │   ├── chunker.yaml
    │   ├── clarifai.yaml
    │   ├── cohere.yaml
    │   ├── full-stack.yaml
    │   ├── google.yaml
    │   ├── gpt4.yaml
    │   ├── gpt4all.yaml
    │   ├── huggingface.yaml
    │   ├── jina.yaml
    │   ├── llama2.yaml
    │   ├── ollama.yaml
    │   ├── opensearch.yaml
    │   ├── opensource.yaml
    │   ├── pinecone.yaml
    │   ├── pipeline.yaml
    │   ├── together.yaml
    │   ├── vertexai.yaml
    │   ├── vllm.yaml
    │   └── weaviate.yaml
    ├── docs
    │   ├── Makefile
    │   ├── README.md
    │   ├── _snippets
    │   │   ├── get-help.mdx
    │   │   ├── missing-data-source-tip.mdx
    │   │   ├── missing-llm-tip.mdx
    │   │   └── missing-vector-db-tip.mdx
    │   ├── api-reference
    │   │   ├── advanced
    │   │   │   └── configuration.mdx
    │   │   ├── app
    │   │   │   ├── add.mdx
    │   │   │   ├── chat.mdx
    │   │   │   ├── delete.mdx
    │   │   │   ├── deploy.mdx
    │   │   │   ├── evaluate.mdx
    │   │   │   ├── get.mdx
    │   │   │   ├── overview.mdx
    │   │   │   ├── query.mdx
    │   │   │   ├── reset.mdx
    │   │   │   └── search.mdx
    │   │   ├── overview.mdx
    │   │   └── store
    │   │   │   ├── ai-assistants.mdx
    │   │   │   └── openai-assistant.mdx
    │   ├── community
    │   │   └── connect-with-us.mdx
    │   ├── components
    │   │   ├── data-sources
    │   │   │   ├── audio.mdx
    │   │   │   ├── beehiiv.mdx
    │   │   │   ├── csv.mdx
    │   │   │   ├── custom.mdx
    │   │   │   ├── data-type-handling.mdx
    │   │   │   ├── directory.mdx
    │   │   │   ├── discord.mdx
    │   │   │   ├── discourse.mdx
    │   │   │   ├── docs-site.mdx
    │   │   │   ├── docx.mdx
    │   │   │   ├── dropbox.mdx
    │   │   │   ├── excel-file.mdx
    │   │   │   ├── github.mdx
    │   │   │   ├── gmail.mdx
    │   │   │   ├── google-drive.mdx
    │   │   │   ├── image.mdx
    │   │   │   ├── json.mdx
    │   │   │   ├── mdx.mdx
    │   │   │   ├── mysql.mdx
    │   │   │   ├── notion.mdx
    │   │   │   ├── openapi.mdx
    │   │   │   ├── overview.mdx
    │   │   │   ├── pdf-file.mdx
    │   │   │   ├── postgres.mdx
    │   │   │   ├── qna.mdx
    │   │   │   ├── sitemap.mdx
    │   │   │   ├── slack.mdx
    │   │   │   ├── substack.mdx
    │   │   │   ├── text-file.mdx
    │   │   │   ├── text.mdx
    │   │   │   ├── web-page.mdx
    │   │   │   ├── xml.mdx
    │   │   │   ├── youtube-channel.mdx
    │   │   │   └── youtube-video.mdx
    │   │   ├── embedding-models.mdx
    │   │   ├── evaluation.mdx
    │   │   ├── introduction.mdx
    │   │   ├── llms.mdx
    │   │   ├── retrieval-methods.mdx
    │   │   ├── vector-databases.mdx
    │   │   └── vector-databases
    │   │   │   ├── chromadb.mdx
    │   │   │   ├── elasticsearch.mdx
    │   │   │   ├── lancedb.mdx
    │   │   │   ├── opensearch.mdx
    │   │   │   ├── pinecone.mdx
    │   │   │   ├── qdrant.mdx
    │   │   │   ├── weaviate.mdx
    │   │   │   └── zilliz.mdx
    │   ├── contribution
    │   │   ├── dev.mdx
    │   │   ├── docs.mdx
    │   │   ├── guidelines.mdx
    │   │   └── python.mdx
    │   ├── deployment
    │   │   ├── fly_io.mdx
    │   │   ├── gradio_app.mdx
    │   │   ├── huggingface_spaces.mdx
    │   │   ├── modal_com.mdx
    │   │   ├── railway.mdx
    │   │   ├── render_com.mdx
    │   │   └── streamlit_io.mdx
    │   ├── development.mdx
    │   ├── examples
    │   │   ├── chat-with-PDF.mdx
    │   │   ├── community
    │   │   │   └── showcase.mdx
    │   │   ├── discord_bot.mdx
    │   │   ├── full_stack.mdx
    │   │   ├── nextjs-assistant.mdx
    │   │   ├── notebooks-and-replits.mdx
    │   │   ├── openai-assistant.mdx
    │   │   ├── opensource-assistant.mdx
    │   │   ├── poe_bot.mdx
    │   │   ├── rest-api
    │   │   │   ├── add-data.mdx
    │   │   │   ├── chat.mdx
    │   │   │   ├── check-status.mdx
    │   │   │   ├── create.mdx
    │   │   │   ├── delete.mdx
    │   │   │   ├── deploy.mdx
    │   │   │   ├── get-all-apps.mdx
    │   │   │   ├── get-data.mdx
    │   │   │   ├── getting-started.mdx
    │   │   │   └── query.mdx
    │   │   ├── showcase.mdx
    │   │   ├── slack-AI.mdx
    │   │   ├── slack_bot.mdx
    │   │   ├── telegram_bot.mdx
    │   │   └── whatsapp_bot.mdx
    │   ├── favicon.png
    │   ├── get-started
    │   │   ├── deployment.mdx
    │   │   ├── faq.mdx
    │   │   ├── full-stack.mdx
    │   │   ├── integrations.mdx
    │   │   ├── introduction.mdx
    │   │   └── quickstart.mdx
    │   ├── images
    │   │   ├── checks-passed.png
    │   │   ├── cover.gif
    │   │   ├── fly_io.png
    │   │   ├── fullstack-api-server.png
    │   │   ├── fullstack-chunks.png
    │   │   ├── fullstack.png
    │   │   ├── gradio_app.png
    │   │   ├── helicone-embedchain.png
    │   │   ├── langsmith.png
    │   │   ├── og.png
    │   │   ├── slack-ai.png
    │   │   └── whatsapp.jpg
    │   ├── integration
    │   │   ├── chainlit.mdx
    │   │   ├── helicone.mdx
    │   │   ├── langsmith.mdx
    │   │   ├── openlit.mdx
    │   │   └── streamlit-mistral.mdx
    │   ├── logo
    │   │   ├── dark-rt.svg
    │   │   ├── dark.svg
    │   │   ├── light-rt.svg
    │   │   └── light.svg
    │   ├── mint.json
    │   ├── product
    │   │   └── release-notes.mdx
    │   ├── rest-api.json
    │   ├── support
    │   │   └── get-help.mdx
    │   └── use-cases
    │   │   ├── chatbots.mdx
    │   │   ├── introduction.mdx
    │   │   ├── question-answering.mdx
    │   │   └── semantic-search.mdx
    ├── embedchain
    │   ├── __init__.py
    │   ├── alembic.ini
    │   ├── app.py
    │   ├── bots
    │   │   ├── __init__.py
    │   │   ├── base.py
    │   │   ├── discord.py
    │   │   ├── poe.py
    │   │   ├── slack.py
    │   │   └── whatsapp.py
    │   ├── cache.py
    │   ├── chunkers
    │   │   ├── __init__.py
    │   │   ├── audio.py
    │   │   ├── base_chunker.py
    │   │   ├── beehiiv.py
    │   │   ├── common_chunker.py
    │   │   ├── discourse.py
    │   │   ├── docs_site.py
    │   │   ├── docx_file.py
    │   │   ├── excel_file.py
    │   │   ├── gmail.py
    │   │   ├── google_drive.py
    │   │   ├── image.py
    │   │   ├── json.py
    │   │   ├── mdx.py
    │   │   ├── mysql.py
    │   │   ├── notion.py
    │   │   ├── openapi.py
    │   │   ├── pdf_file.py
    │   │   ├── postgres.py
    │   │   ├── qna_pair.py
    │   │   ├── rss_feed.py
    │   │   ├── sitemap.py
    │   │   ├── slack.py
    │   │   ├── substack.py
    │   │   ├── table.py
    │   │   ├── text.py
    │   │   ├── unstructured_file.py
    │   │   ├── web_page.py
    │   │   ├── xml.py
    │   │   └── youtube_video.py
    │   ├── cli.py
    │   ├── client.py
    │   ├── config
    │   │   ├── __init__.py
    │   │   ├── add_config.py
    │   │   ├── app_config.py
    │   │   ├── base_app_config.py
    │   │   ├── base_config.py
    │   │   ├── cache_config.py
    │   │   ├── embedder
    │   │   │   ├── __init__.py
    │   │   │   ├── aws_bedrock.py
    │   │   │   ├── base.py
    │   │   │   ├── google.py
    │   │   │   └── ollama.py
    │   │   ├── evaluation
    │   │   │   ├── __init__.py
    │   │   │   └── base.py
    │   │   ├── llm
    │   │   │   ├── __init__.py
    │   │   │   └── base.py
    │   │   ├── mem0_config.py
    │   │   ├── model_prices_and_context_window.json
    │   │   ├── vector_db
    │   │   │   ├── base.py
    │   │   │   ├── chroma.py
    │   │   │   ├── elasticsearch.py
    │   │   │   ├── lancedb.py
    │   │   │   ├── opensearch.py
    │   │   │   ├── pinecone.py
    │   │   │   ├── qdrant.py
    │   │   │   ├── weaviate.py
    │   │   │   └── zilliz.py
    │   │   └── vectordb
    │   │   │   └── __init__.py
    │   ├── constants.py
    │   ├── core
    │   │   ├── __init__.py
    │   │   └── db
    │   │   │   ├── __init__.py
    │   │   │   ├── database.py
    │   │   │   └── models.py
    │   ├── data_formatter
    │   │   ├── __init__.py
    │   │   └── data_formatter.py
    │   ├── deployment
    │   │   ├── fly.io
    │   │   │   ├── .dockerignore
    │   │   │   ├── .env.example
    │   │   │   ├── Dockerfile
    │   │   │   ├── app.py
    │   │   │   └── requirements.txt
    │   │   ├── gradio.app
    │   │   │   ├── app.py
    │   │   │   └── requirements.txt
    │   │   ├── modal.com
    │   │   │   ├── .env.example
    │   │   │   ├── .gitignore
    │   │   │   ├── app.py
    │   │   │   └── requirements.txt
    │   │   ├── render.com
    │   │   │   ├── .env.example
    │   │   │   ├── .gitignore
    │   │   │   ├── app.py
    │   │   │   ├── render.yaml
    │   │   │   └── requirements.txt
    │   │   └── streamlit.io
    │   │   │   ├── .streamlit
    │   │   │       └── secrets.toml
    │   │   │   ├── app.py
    │   │   │   └── requirements.txt
    │   ├── embedchain.py
    │   ├── embedder
    │   │   ├── __init__.py
    │   │   ├── aws_bedrock.py
    │   │   ├── azure_openai.py
    │   │   ├── base.py
    │   │   ├── clarifai.py
    │   │   ├── cohere.py
    │   │   ├── google.py
    │   │   ├── gpt4all.py
    │   │   ├── huggingface.py
    │   │   ├── mistralai.py
    │   │   ├── nvidia.py
    │   │   ├── ollama.py
    │   │   ├── openai.py
    │   │   └── vertexai.py
    │   ├── evaluation
    │   │   ├── __init__.py
    │   │   ├── base.py
    │   │   └── metrics
    │   │   │   ├── __init__.py
    │   │   │   ├── answer_relevancy.py
    │   │   │   ├── context_relevancy.py
    │   │   │   └── groundedness.py
    │   ├── factory.py
    │   ├── helpers
    │   │   ├── __init__.py
    │   │   ├── callbacks.py
    │   │   └── json_serializable.py
    │   ├── llm
    │   │   ├── __init__.py
    │   │   ├── anthropic.py
    │   │   ├── aws_bedrock.py
    │   │   ├── azure_openai.py
    │   │   ├── base.py
    │   │   ├── clarifai.py
    │   │   ├── cohere.py
    │   │   ├── google.py
    │   │   ├── gpt4all.py
    │   │   ├── groq.py
    │   │   ├── huggingface.py
    │   │   ├── jina.py
    │   │   ├── llama2.py
    │   │   ├── mistralai.py
    │   │   ├── nvidia.py
    │   │   ├── ollama.py
    │   │   ├── openai.py
    │   │   ├── together.py
    │   │   ├── vertex_ai.py
    │   │   └── vllm.py
    │   ├── loaders
    │   │   ├── __init__.py
    │   │   ├── audio.py
    │   │   ├── base_loader.py
    │   │   ├── beehiiv.py
    │   │   ├── csv.py
    │   │   ├── directory_loader.py
    │   │   ├── discord.py
    │   │   ├── discourse.py
    │   │   ├── docs_site_loader.py
    │   │   ├── docx_file.py
    │   │   ├── dropbox.py
    │   │   ├── excel_file.py
    │   │   ├── github.py
    │   │   ├── gmail.py
    │   │   ├── google_drive.py
    │   │   ├── image.py
    │   │   ├── json.py
    │   │   ├── local_qna_pair.py
    │   │   ├── local_text.py
    │   │   ├── mdx.py
    │   │   ├── mysql.py
    │   │   ├── notion.py
    │   │   ├── openapi.py
    │   │   ├── pdf_file.py
    │   │   ├── postgres.py
    │   │   ├── rss_feed.py
    │   │   ├── sitemap.py
    │   │   ├── slack.py
    │   │   ├── substack.py
    │   │   ├── text_file.py
    │   │   ├── unstructured_file.py
    │   │   ├── web_page.py
    │   │   ├── xml.py
    │   │   ├── youtube_channel.py
    │   │   └── youtube_video.py
    │   ├── memory
    │   │   ├── __init__.py
    │   │   ├── base.py
    │   │   ├── message.py
    │   │   └── utils.py
    │   ├── migrations
    │   │   ├── env.py
    │   │   ├── script.py.mako
    │   │   └── versions
    │   │   │   └── 40a327b3debd_create_initial_migrations.py
    │   ├── models
    │   │   ├── __init__.py
    │   │   ├── data_type.py
    │   │   ├── embedding_functions.py
    │   │   ├── providers.py
    │   │   └── vector_dimensions.py
    │   ├── pipeline.py
    │   ├── store
    │   │   ├── __init__.py
    │   │   └── assistants.py
    │   ├── telemetry
    │   │   ├── __init__.py
    │   │   └── posthog.py
    │   ├── utils
    │   │   ├── __init__.py
    │   │   ├── cli.py
    │   │   ├── evaluation.py
    │   │   └── misc.py
    │   └── vectordb
    │   │   ├── __init__.py
    │   │   ├── base.py
    │   │   ├── chroma.py
    │   │   ├── elasticsearch.py
    │   │   ├── lancedb.py
    │   │   ├── opensearch.py
    │   │   ├── pinecone.py
    │   │   ├── qdrant.py
    │   │   ├── weaviate.py
    │   │   └── zilliz.py
    ├── examples
    │   ├── api_server
    │   │   ├── .dockerignore
    │   │   ├── .gitignore
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── api_server.py
    │   │   ├── docker-compose.yml
    │   │   ├── requirements.txt
    │   │   └── variables.env
    │   ├── chainlit
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── app.py
    │   │   ├── chainlit.md
    │   │   └── requirements.txt
    │   ├── chat-pdf
    │   │   ├── README.md
    │   │   ├── app.py
    │   │   ├── embedchain.json
    │   │   └── requirements.txt
    │   ├── discord_bot
    │   │   ├── .dockerignore
    │   │   ├── .gitignore
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── discord_bot.py
    │   │   ├── docker-compose.yml
    │   │   ├── requirements.txt
    │   │   └── variables.env
    │   ├── full_stack
    │   │   ├── .dockerignore
    │   │   ├── README.md
    │   │   ├── backend
    │   │   │   ├── .dockerignore
    │   │   │   ├── .gitignore
    │   │   │   ├── Dockerfile
    │   │   │   ├── models.py
    │   │   │   ├── paths.py
    │   │   │   ├── requirements.txt
    │   │   │   ├── routes
    │   │   │   │   ├── chat_response.py
    │   │   │   │   ├── dashboard.py
    │   │   │   │   └── sources.py
    │   │   │   └── server.py
    │   │   ├── docker-compose.yml
    │   │   └── frontend
    │   │   │   ├── .dockerignore
    │   │   │   ├── .eslintrc.json
    │   │   │   ├── .gitignore
    │   │   │   ├── Dockerfile
    │   │   │   ├── jsconfig.json
    │   │   │   ├── next.config.js
    │   │   │   ├── package-lock.json
    │   │   │   ├── package.json
    │   │   │   ├── postcss.config.js
    │   │   │   ├── public
    │   │   │       ├── favicon.ico
    │   │   │       ├── icons
    │   │   │       │   ├── bot.svg
    │   │   │       │   ├── close.svg
    │   │   │       │   ├── cross.svg
    │   │   │       │   ├── dashboard.svg
    │   │   │       │   ├── doc.svg
    │   │   │       │   ├── drawer.svg
    │   │   │       │   ├── dropdown.svg
    │   │   │       │   ├── dropup.svg
    │   │   │       │   ├── github.svg
    │   │   │       │   ├── linkedin.svg
    │   │   │       │   ├── pdf.svg
    │   │   │       │   ├── plus.svg
    │   │   │       │   ├── settings.svg
    │   │   │       │   ├── sitemap.svg
    │   │   │       │   ├── text.svg
    │   │   │       │   ├── twitter.svg
    │   │   │       │   ├── web.svg
    │   │   │       │   └── youtube.svg
    │   │   │       └── images
    │   │   │       │   └── embedchain.png
    │   │   │   ├── src
    │   │   │       ├── components
    │   │   │       │   ├── PageWrapper.js
    │   │   │       │   ├── chat
    │   │   │       │   │   ├── BotWrapper.js
    │   │   │       │   │   └── HumanWrapper.js
    │   │   │       │   └── dashboard
    │   │   │       │   │   ├── CreateBot.js
    │   │   │       │   │   ├── DeleteBot.js
    │   │   │       │   │   ├── PurgeChats.js
    │   │   │       │   │   └── SetOpenAIKey.js
    │   │   │       ├── containers
    │   │   │       │   ├── ChatWindow.js
    │   │   │       │   ├── SetSources.js
    │   │   │       │   └── Sidebar.js
    │   │   │       ├── pages
    │   │   │       │   ├── [bot_slug]
    │   │   │       │   │   └── app.js
    │   │   │       │   ├── _app.js
    │   │   │       │   ├── _document.js
    │   │   │       │   └── index.js
    │   │   │       └── styles
    │   │   │       │   └── globals.css
    │   │   │   └── tailwind.config.js
    │   ├── mistral-streamlit
    │   │   ├── README.md
    │   │   ├── app.py
    │   │   ├── config.yaml
    │   │   └── requirements.txt
    │   ├── nextjs
    │   │   ├── README.md
    │   │   ├── ec_app
    │   │   │   ├── .dockerignore
    │   │   │   ├── .env.example
    │   │   │   ├── Dockerfile
    │   │   │   ├── app.py
    │   │   │   ├── embedchain.json
    │   │   │   ├── fly.toml
    │   │   │   └── requirements.txt
    │   │   ├── nextjs_discord
    │   │   │   ├── .dockerignore
    │   │   │   ├── .env.example
    │   │   │   ├── Dockerfile
    │   │   │   ├── app.py
    │   │   │   ├── embedchain.json
    │   │   │   ├── fly.toml
    │   │   │   └── requirements.txt
    │   │   ├── nextjs_slack
    │   │   │   ├── .dockerignore
    │   │   │   ├── .env.example
    │   │   │   ├── Dockerfile
    │   │   │   ├── app.py
    │   │   │   ├── embedchain.json
    │   │   │   ├── fly.toml
    │   │   │   └── requirements.txt
    │   │   └── requirements.txt
    │   ├── private-ai
    │   │   ├── README.md
    │   │   ├── config.yaml
    │   │   ├── privateai.py
    │   │   └── requirements.txt
    │   ├── rest-api
    │   │   ├── .dockerignore
    │   │   ├── .gitignore
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── __init__.py
    │   │   ├── bruno
    │   │   │   └── ec-rest-api
    │   │   │   │   ├── bruno.json
    │   │   │   │   ├── default_add.bru
    │   │   │   │   ├── default_chat.bru
    │   │   │   │   ├── default_query.bru
    │   │   │   │   └── ping.bru
    │   │   ├── configs
    │   │   │   └── README.md
    │   │   ├── database.py
    │   │   ├── default.yaml
    │   │   ├── main.py
    │   │   ├── models.py
    │   │   ├── requirements.txt
    │   │   ├── sample-config.yaml
    │   │   ├── services.py
    │   │   └── utils.py
    │   ├── sadhguru-ai
    │   │   ├── README.md
    │   │   ├── app.py
    │   │   └── requirements.txt
    │   ├── slack_bot
    │   │   ├── Dockerfile
    │   │   └── requirements.txt
    │   ├── telegram_bot
    │   │   ├── .env.example
    │   │   ├── .gitignore
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── requirements.txt
    │   │   └── telegram_bot.py
    │   ├── unacademy-ai
    │   │   ├── README.md
    │   │   ├── app.py
    │   │   └── requirements.txt
    │   └── whatsapp_bot
    │   │   ├── .env.example
    │   │   ├── .gitignore
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── requirements.txt
    │   │   ├── run.py
    │   │   └── whatsapp_bot.py
    ├── notebooks
    │   ├── anthropic.ipynb
    │   ├── aws-bedrock.ipynb
    │   ├── azure-openai.ipynb
    │   ├── azure_openai.yaml
    │   ├── chromadb.ipynb
    │   ├── clarifai.ipynb
    │   ├── cohere.ipynb
    │   ├── elasticsearch.ipynb
    │   ├── embedchain-chromadb-server.ipynb
    │   ├── embedchain-docs-site-example.ipynb
    │   ├── gpt4all.ipynb
    │   ├── hugging_face_hub.ipynb
    │   ├── jina.ipynb
    │   ├── lancedb.ipynb
    │   ├── llama2.ipynb
    │   ├── ollama.ipynb
    │   ├── openai.ipynb
    │   ├── openai_azure.yaml
    │   ├── opensearch.ipynb
    │   ├── pinecone.ipynb
    │   ├── together.ipynb
    │   └── vertex_ai.ipynb
    ├── poetry.lock
    ├── poetry.toml
    ├── pyproject.toml
    └── tests
    │   ├── __init__.py
    │   ├── chunkers
    │       ├── test_base_chunker.py
    │       ├── test_chunkers.py
    │       └── test_text.py
    │   ├── conftest.py
    │   ├── embedchain
    │       ├── test_add.py
    │       ├── test_embedchain.py
    │       └── test_utils.py
    │   ├── embedder
    │       ├── test_aws_bedrock_embedder.py
    │       ├── test_azure_openai_embedder.py
    │       ├── test_embedder.py
    │       └── test_huggingface_embedder.py
    │   ├── evaluation
    │       ├── test_answer_relevancy_metric.py
    │       ├── test_context_relevancy_metric.py
    │       └── test_groundedness_metric.py
    │   ├── helper_classes
    │       └── test_json_serializable.py
    │   ├── llm
    │       ├── conftest.py
    │       ├── test_anthrophic.py
    │       ├── test_aws_bedrock.py
    │       ├── test_azure_openai.py
    │       ├── test_base_llm.py
    │       ├── test_chat.py
    │       ├── test_clarifai.py
    │       ├── test_cohere.py
    │       ├── test_generate_prompt.py
    │       ├── test_google.py
    │       ├── test_gpt4all.py
    │       ├── test_huggingface.py
    │       ├── test_jina.py
    │       ├── test_llama2.py
    │       ├── test_mistralai.py
    │       ├── test_ollama.py
    │       ├── test_openai.py
    │       ├── test_query.py
    │       ├── test_together.py
    │       └── test_vertex_ai.py
    │   ├── loaders
    │       ├── test_audio.py
    │       ├── test_csv.py
    │       ├── test_discourse.py
    │       ├── test_docs_site.py
    │       ├── test_docs_site_loader.py
    │       ├── test_docx_file.py
    │       ├── test_dropbox.py
    │       ├── test_excel_file.py
    │       ├── test_github.py
    │       ├── test_gmail.py
    │       ├── test_google_drive.py
    │       ├── test_json.py
    │       ├── test_local_qna_pair.py
    │       ├── test_local_text.py
    │       ├── test_mdx.py
    │       ├── test_mysql.py
    │       ├── test_notion.py
    │       ├── test_openapi.py
    │       ├── test_pdf_file.py
    │       ├── test_postgres.py
    │       ├── test_slack.py
    │       ├── test_web_page.py
    │       ├── test_xml.py
    │       └── test_youtube_video.py
    │   ├── memory
    │       ├── test_chat_memory.py
    │       └── test_memory_messages.py
    │   ├── models
    │       └── test_data_type.py
    │   ├── telemetry
    │       └── test_posthog.py
    │   ├── test_app.py
    │   ├── test_client.py
    │   ├── test_factory.py
    │   ├── test_utils.py
    │   └── vectordb
    │       ├── test_chroma_db.py
    │       ├── test_elasticsearch_db.py
    │       ├── test_lancedb.py
    │       ├── test_pinecone.py
    │       ├── test_qdrant.py
    │       ├── test_weaviate.py
    │       └── test_zilliz_db.py
├── evaluation
    ├── Makefile
    ├── README.md
    ├── evals.py
    ├── generate_scores.py
    ├── metrics
    │   ├── llm_judge.py
    │   └── utils.py
    ├── prompts.py
    ├── run_experiments.py
    └── src
    │   ├── langmem.py
    │   ├── memzero
    │       ├── add.py
    │       └── search.py
    │   ├── openai
    │       └── predict.py
    │   ├── rag.py
    │   ├── utils.py
    │   └── zep
    │       ├── add.py
    │       └── search.py
├── examples
    ├── graph-db-demo
    │   ├── alice-memories.png
    │   ├── memgraph-example.ipynb
    │   └── neo4j-example.ipynb
    ├── mem0-demo
    │   ├── .env.example
    │   ├── .gitignore
    │   ├── app
    │   │   ├── api
    │   │   │   └── chat
    │   │   │   │   └── route.ts
    │   │   ├── assistant.tsx
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components.json
    │   ├── components
    │   │   ├── assistant-ui
    │   │   │   ├── markdown-text.tsx
    │   │   │   ├── memory-indicator.tsx
    │   │   │   ├── memory-ui.tsx
    │   │   │   ├── theme-aware-logo.tsx
    │   │   │   ├── thread-list.tsx
    │   │   │   ├── thread.tsx
    │   │   │   └── tooltip-icon-button.tsx
    │   │   ├── mem0
    │   │   │   ├── github-button.tsx
    │   │   │   ├── markdown.css
    │   │   │   ├── markdown.tsx
    │   │   │   └── theme-aware-logo.tsx
    │   │   └── ui
    │   │   │   ├── alert-dialog.tsx
    │   │   │   ├── avatar.tsx
    │   │   │   ├── badge.tsx
    │   │   │   ├── button.tsx
    │   │   │   ├── popover.tsx
    │   │   │   ├── scroll-area.tsx
    │   │   │   └── tooltip.tsx
    │   ├── eslint.config.mjs
    │   ├── images
    │   │   ├── assistant-ui-dark.svg
    │   │   ├── assistant-ui.svg
    │   │   ├── dark.svg
    │   │   └── light.svg
    │   ├── lib
    │   │   └── utils.ts
    │   ├── next-env.d.ts
    │   ├── next.config.ts
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── public
    │   │   ├── file.svg
    │   │   ├── globe.svg
    │   │   ├── next.svg
    │   │   ├── vercel.svg
    │   │   └── window.svg
    │   ├── tailwind.config.ts
    │   └── tsconfig.json
    ├── misc
    │   ├── fitness_checker.py
    │   ├── healthcare_assistant_google_adk.py
    │   ├── movie_recommendation_grok3.py
    │   ├── personal_assistant_agno.py
    │   ├── study_buddy.py
    │   └── voice_assistant_elevenlabs.py
    ├── multimodal-demo
    │   ├── .gitattributes
    │   ├── .gitignore
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── public
    │   │   └── mem0_logo.jpeg
    │   ├── src
    │   │   ├── App.tsx
    │   │   ├── assets
    │   │   │   ├── mem0_logo.jpeg
    │   │   │   ├── react.svg
    │   │   │   └── user.jpg
    │   │   ├── components
    │   │   │   ├── api-settings-popup.tsx
    │   │   │   ├── chevron-toggle.tsx
    │   │   │   ├── header.tsx
    │   │   │   ├── input-area.tsx
    │   │   │   ├── memories.tsx
    │   │   │   ├── messages.tsx
    │   │   │   └── ui
    │   │   │   │   ├── avatar.tsx
    │   │   │   │   ├── badge.tsx
    │   │   │   │   ├── button.tsx
    │   │   │   │   ├── card.tsx
    │   │   │   │   ├── dialog.tsx
    │   │   │   │   ├── input.tsx
    │   │   │   │   ├── label.tsx
    │   │   │   │   ├── scroll-area.tsx
    │   │   │   │   └── select.tsx
    │   │   ├── constants
    │   │   │   └── messages.ts
    │   │   ├── contexts
    │   │   │   └── GlobalContext.tsx
    │   │   ├── hooks
    │   │   │   ├── useAuth.ts
    │   │   │   ├── useChat.ts
    │   │   │   └── useFileHandler.ts
    │   │   ├── index.css
    │   │   ├── libs
    │   │   │   └── utils.ts
    │   │   ├── main.tsx
    │   │   ├── page.tsx
    │   │   ├── pages
    │   │   │   └── home.tsx
    │   │   ├── types.ts
    │   │   ├── utils
    │   │   │   └── fileUtils.ts
    │   │   └── vite-env.d.ts
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── useChat.ts
    │   └── vite.config.ts
    ├── openai-inbuilt-tools
    │   ├── index.js
    │   └── package.json
    ├── vercel-ai-sdk-chat-app
    │   ├── .gitattributes
    │   ├── .gitignore
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── public
    │   │   └── mem0_logo.jpeg
    │   ├── src
    │   │   ├── App.tsx
    │   │   ├── assets
    │   │   │   ├── mem0_logo.jpeg
    │   │   │   ├── react.svg
    │   │   │   └── user.jpg
    │   │   ├── components
    │   │   │   ├── api-settings-popup.tsx
    │   │   │   ├── chevron-toggle.tsx
    │   │   │   ├── header.tsx
    │   │   │   ├── input-area.tsx
    │   │   │   ├── memories.tsx
    │   │   │   ├── messages.tsx
    │   │   │   └── ui
    │   │   │   │   ├── avatar.tsx
    │   │   │   │   ├── badge.tsx
    │   │   │   │   ├── button.tsx
    │   │   │   │   ├── card.tsx
    │   │   │   │   ├── dialog.tsx
    │   │   │   │   ├── input.tsx
    │   │   │   │   ├── label.tsx
    │   │   │   │   ├── scroll-area.tsx
    │   │   │   │   └── select.tsx
    │   │   ├── constants
    │   │   │   └── messages.ts
    │   │   ├── contexts
    │   │   │   └── GlobalContext.tsx
    │   │   ├── hooks
    │   │   │   ├── useAuth.ts
    │   │   │   ├── useChat.ts
    │   │   │   └── useFileHandler.ts
    │   │   ├── index.css
    │   │   ├── libs
    │   │   │   └── utils.ts
    │   │   ├── main.tsx
    │   │   ├── page.tsx
    │   │   ├── pages
    │   │   │   └── home.tsx
    │   │   ├── types.ts
    │   │   ├── utils
    │   │   │   └── fileUtils.ts
    │   │   └── vite-env.d.ts
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    └── yt-assistant-chrome
    │   ├── .gitignore
    │   ├── README.md
    │   ├── assets
    │       └── dark.svg
    │   ├── manifest.json
    │   ├── package.json
    │   ├── public
    │       ├── options.html
    │       └── popup.html
    │   ├── src
    │       ├── background.js
    │       ├── content.js
    │       ├── options.js
    │       └── popup.js
    │   ├── styles
    │       ├── content.css
    │       ├── options.css
    │       └── popup.css
    │   └── webpack.config.js
├── mem0-ts
    ├── README.md
    ├── jest.config.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src
    │   ├── client
    │   │   ├── index.ts
    │   │   ├── mem0.ts
    │   │   ├── mem0.types.ts
    │   │   ├── telemetry.ts
    │   │   ├── telemetry.types.ts
    │   │   └── tests
    │   │   │   └── memoryClient.test.ts
    │   ├── community
    │   │   ├── .prettierignore
    │   │   ├── package.json
    │   │   ├── src
    │   │   │   ├── index.ts
    │   │   │   └── integrations
    │   │   │   │   └── langchain
    │   │   │   │       ├── index.ts
    │   │   │   │       └── mem0.ts
    │   │   └── tsconfig.json
    │   └── oss
    │   │   ├── .env.example
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── examples
    │   │       ├── basic.ts
    │   │       ├── llms
    │   │       │   └── mistral-example.ts
    │   │       ├── local-llms.ts
    │   │       ├── utils
    │   │       │   └── test-utils.ts
    │   │       └── vector-stores
    │   │       │   ├── index.ts
    │   │       │   ├── memory.ts
    │   │       │   ├── pgvector.ts
    │   │       │   ├── qdrant.ts
    │   │       │   ├── redis.ts
    │   │       │   └── supabase.ts
    │   │   ├── package.json
    │   │   ├── src
    │   │       ├── config
    │   │       │   ├── defaults.ts
    │   │       │   └── manager.ts
    │   │       ├── embeddings
    │   │       │   ├── azure.ts
    │   │       │   ├── base.ts
    │   │       │   ├── google.ts
    │   │       │   ├── langchain.ts
    │   │       │   ├── ollama.ts
    │   │       │   └── openai.ts
    │   │       ├── graphs
    │   │       │   ├── configs.ts
    │   │       │   ├── tools.ts
    │   │       │   └── utils.ts
    │   │       ├── index.ts
    │   │       ├── llms
    │   │       │   ├── anthropic.ts
    │   │       │   ├── azure.ts
    │   │       │   ├── base.ts
    │   │       │   ├── google.ts
    │   │       │   ├── groq.ts
    │   │       │   ├── langchain.ts
    │   │       │   ├── mistral.ts
    │   │       │   ├── ollama.ts
    │   │       │   ├── openai.ts
    │   │       │   └── openai_structured.ts
    │   │       ├── memory
    │   │       │   ├── graph_memory.ts
    │   │       │   ├── index.ts
    │   │       │   └── memory.types.ts
    │   │       ├── prompts
    │   │       │   └── index.ts
    │   │       ├── storage
    │   │       │   ├── DummyHistoryManager.ts
    │   │       │   ├── MemoryHistoryManager.ts
    │   │       │   ├── SQLiteManager.ts
    │   │       │   ├── SupabaseHistoryManager.ts
    │   │       │   ├── base.ts
    │   │       │   └── index.ts
    │   │       ├── types
    │   │       │   └── index.ts
    │   │       ├── utils
    │   │       │   ├── bm25.ts
    │   │       │   ├── factory.ts
    │   │       │   ├── logger.ts
    │   │       │   ├── memory.ts
    │   │       │   ├── telemetry.ts
    │   │       │   └── telemetry.types.ts
    │   │       └── vector_stores
    │   │       │   ├── base.ts
    │   │       │   ├── langchain.ts
    │   │       │   ├── memory.ts
    │   │       │   ├── pgvector.ts
    │   │       │   ├── qdrant.ts
    │   │       │   ├── redis.ts
    │   │       │   ├── supabase.ts
    │   │       │   └── vectorize.ts
    │   │   ├── tests
    │   │       └── memory.test.ts
    │   │   └── tsconfig.json
    ├── tests
    │   └── .gitkeep
    ├── tsconfig.json
    ├── tsconfig.test.json
    └── tsup.config.ts
├── mem0
    ├── __init__.py
    ├── client
    │   ├── __init__.py
    │   └── main.py
    ├── configs
    │   ├── __init__.py
    │   ├── base.py
    │   ├── embeddings
    │   │   ├── __init__.py
    │   │   └── base.py
    │   ├── enums.py
    │   ├── llms
    │   │   ├── __init__.py
    │   │   └── base.py
    │   ├── prompts.py
    │   └── vector_stores
    │   │   ├── __init__.py
    │   │   ├── azure_ai_search.py
    │   │   ├── chroma.py
    │   │   ├── elasticsearch.py
    │   │   ├── faiss.py
    │   │   ├── langchain.py
    │   │   ├── milvus.py
    │   │   ├── mongodb.py
    │   │   ├── opensearch.py
    │   │   ├── pgvector.py
    │   │   ├── pinecone.py
    │   │   ├── qdrant.py
    │   │   ├── redis.py
    │   │   ├── supabase.py
    │   │   ├── upstash_vector.py
    │   │   ├── vertex_ai_vector_search.py
    │   │   └── weaviate.py
    ├── embeddings
    │   ├── __init__.py
    │   ├── aws_bedrock.py
    │   ├── azure_openai.py
    │   ├── base.py
    │   ├── configs.py
    │   ├── gemini.py
    │   ├── huggingface.py
    │   ├── langchain.py
    │   ├── lmstudio.py
    │   ├── mock.py
    │   ├── ollama.py
    │   ├── openai.py
    │   ├── together.py
    │   └── vertexai.py
    ├── graphs
    │   ├── configs.py
    │   ├── tools.py
    │   └── utils.py
    ├── llms
    │   ├── __init__.py
    │   ├── anthropic.py
    │   ├── aws_bedrock.py
    │   ├── azure_openai.py
    │   ├── azure_openai_structured.py
    │   ├── base.py
    │   ├── configs.py
    │   ├── deepseek.py
    │   ├── gemini.py
    │   ├── groq.py
    │   ├── langchain.py
    │   ├── litellm.py
    │   ├── lmstudio.py
    │   ├── ollama.py
    │   ├── openai.py
    │   ├── openai_structured.py
    │   ├── sarvam.py
    │   ├── together.py
    │   ├── utils
    │   │   ├── __init__.py
    │   │   └── functions.py
    │   └── xai.py
    ├── memory
    │   ├── __init__.py
    │   ├── base.py
    │   ├── graph_memory.py
    │   ├── main.py
    │   ├── memgraph_memory.py
    │   ├── setup.py
    │   ├── storage.py
    │   ├── telemetry.py
    │   └── utils.py
    ├── proxy
    │   ├── __init__.py
    │   └── main.py
    ├── utils
    │   └── factory.py
    └── vector_stores
    │   ├── __init__.py
    │   ├── azure_ai_search.py
    │   ├── base.py
    │   ├── chroma.py
    │   ├── configs.py
    │   ├── elasticsearch.py
    │   ├── faiss.py
    │   ├── langchain.py
    │   ├── milvus.py
    │   ├── mongodb.py
    │   ├── opensearch.py
    │   ├── pgvector.py
    │   ├── pinecone.py
    │   ├── qdrant.py
    │   ├── redis.py
    │   ├── supabase.py
    │   ├── upstash_vector.py
    │   ├── vertex_ai_vector_search.py
    │   └── weaviate.py
├── openmemory
    ├── .gitignore
    ├── CONTRIBUTING.md
    ├── Makefile
    ├── README.md
    ├── api
    │   ├── .dockerignore
    │   ├── .env.example
    │   ├── .python-version
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── alembic.ini
    │   ├── alembic
    │   │   ├── README
    │   │   ├── env.py
    │   │   ├── script.py.mako
    │   │   └── versions
    │   │   │   ├── 0b53c747049a_initial_migration.py
    │   │   │   ├── add_config_table.py
    │   │   │   └── afd00efbd06b_add_unique_user_id_constraints.py
    │   ├── app
    │   │   ├── __init__.py
    │   │   ├── config.py
    │   │   ├── database.py
    │   │   ├── mcp_server.py
    │   │   ├── models.py
    │   │   ├── routers
    │   │   │   ├── __init__.py
    │   │   │   ├── apps.py
    │   │   │   ├── config.py
    │   │   │   ├── memories.py
    │   │   │   └── stats.py
    │   │   ├── schemas.py
    │   │   └── utils
    │   │   │   ├── __init__.py
    │   │   │   ├── categorization.py
    │   │   │   ├── db.py
    │   │   │   ├── memory.py
    │   │   │   ├── permissions.py
    │   │   │   └── prompts.py
    │   ├── config.json
    │   ├── default_config.json
    │   ├── main.py
    │   └── requirements.txt
    ├── docker-compose.yml
    ├── run.sh
    └── ui
    │   ├── .dockerignore
    │   ├── .env.example
    │   ├── Dockerfile
    │   ├── app
    │       ├── apps
    │       │   ├── [appId]
    │       │   │   ├── components
    │       │   │   │   ├── AppDetailCard.tsx
    │       │   │   │   └── MemoryCard.tsx
    │       │   │   └── page.tsx
    │       │   ├── components
    │       │   │   ├── AppCard.tsx
    │       │   │   ├── AppFilters.tsx
    │       │   │   └── AppGrid.tsx
    │       │   └── page.tsx
    │       ├── globals.css
    │       ├── layout.tsx
    │       ├── loading.tsx
    │       ├── memories
    │       │   ├── components
    │       │   │   ├── CreateMemoryDialog.tsx
    │       │   │   ├── FilterComponent.tsx
    │       │   │   ├── MemoriesSection.tsx
    │       │   │   ├── MemoryFilters.tsx
    │       │   │   ├── MemoryPagination.tsx
    │       │   │   ├── MemoryTable.tsx
    │       │   │   └── PageSizeSelector.tsx
    │       │   └── page.tsx
    │       ├── memory
    │       │   └── [id]
    │       │   │   ├── components
    │       │   │       ├── AccessLog.tsx
    │       │   │       ├── MemoryActions.tsx
    │       │   │       ├── MemoryDetails.tsx
    │       │   │       └── RelatedMemories.tsx
    │       │   │   └── page.tsx
    │       ├── not-found.tsx
    │       ├── page.tsx
    │       ├── providers.tsx
    │       └── settings
    │       │   └── page.tsx
    │   ├── components.json
    │   ├── components
    │       ├── Navbar.tsx
    │       ├── dashboard
    │       │   ├── Install.tsx
    │       │   └── Stats.tsx
    │       ├── form-view.tsx
    │       ├── json-editor.tsx
    │       ├── shared
    │       │   ├── categories.tsx
    │       │   ├── source-app.tsx
    │       │   └── update-memory.tsx
    │       ├── theme-provider.tsx
    │       ├── types.ts
    │       └── ui
    │       │   ├── accordion.tsx
    │       │   ├── alert-dialog.tsx
    │       │   ├── alert.tsx
    │       │   ├── aspect-ratio.tsx
    │       │   ├── avatar.tsx
    │       │   ├── badge.tsx
    │       │   ├── breadcrumb.tsx
    │       │   ├── button.tsx
    │       │   ├── calendar.tsx
    │       │   ├── card.tsx
    │       │   ├── carousel.tsx
    │       │   ├── chart.tsx
    │       │   ├── checkbox.tsx
    │       │   ├── collapsible.tsx
    │       │   ├── command.tsx
    │       │   ├── context-menu.tsx
    │       │   ├── dialog.tsx
    │       │   ├── drawer.tsx
    │       │   ├── dropdown-menu.tsx
    │       │   ├── form.tsx
    │       │   ├── hover-card.tsx
    │       │   ├── input-otp.tsx
    │       │   ├── input.tsx
    │       │   ├── label.tsx
    │       │   ├── menubar.tsx
    │       │   ├── navigation-menu.tsx
    │       │   ├── pagination.tsx
    │       │   ├── popover.tsx
    │       │   ├── progress.tsx
    │       │   ├── radio-group.tsx
    │       │   ├── resizable.tsx
    │       │   ├── scroll-area.tsx
    │       │   ├── select.tsx
    │       │   ├── separator.tsx
    │       │   ├── sheet.tsx
    │       │   ├── sidebar.tsx
    │       │   ├── skeleton.tsx
    │       │   ├── slider.tsx
    │       │   ├── sonner.tsx
    │       │   ├── switch.tsx
    │       │   ├── table.tsx
    │       │   ├── tabs.tsx
    │       │   ├── textarea.tsx
    │       │   ├── toast.tsx
    │       │   ├── toaster.tsx
    │       │   ├── toggle-group.tsx
    │       │   ├── toggle.tsx
    │       │   ├── tooltip.tsx
    │       │   ├── use-mobile.tsx
    │       │   └── use-toast.ts
    │   ├── entrypoint.sh
    │   ├── hooks
    │       ├── use-mobile.tsx
    │       ├── use-toast.ts
    │       ├── useAppsApi.ts
    │       ├── useConfig.ts
    │       ├── useFiltersApi.ts
    │       ├── useMemoriesApi.ts
    │       ├── useStats.ts
    │       └── useUI.ts
    │   ├── lib
    │       ├── helpers.ts
    │       └── utils.ts
    │   ├── next-env.d.ts
    │   ├── next.config.dev.mjs
    │   ├── next.config.mjs
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── postcss.config.mjs
    │   ├── public
    │       ├── images
    │       │   ├── claude.webp
    │       │   ├── cline.png
    │       │   ├── cursor.png
    │       │   ├── default.png
    │       │   ├── enconvo.png
    │       │   ├── open-memory.svg
    │       │   ├── roocline.png
    │       │   ├── windsurf.png
    │       │   └── witsy.png
    │       ├── logo.svg
    │       ├── placeholder-logo.png
    │       ├── placeholder-logo.svg
    │       ├── placeholder-user.jpg
    │       ├── placeholder.jpg
    │       └── placeholder.svg
    │   ├── skeleton
    │       ├── AppCardSkeleton.tsx
    │       ├── AppDetailCardSkeleton.tsx
    │       ├── AppFiltersSkeleton.tsx
    │       ├── MemoryCardSkeleton.tsx
    │       ├── MemorySkeleton.tsx
    │       └── MemoryTableSkeleton.tsx
    │   ├── store
    │       ├── appsSlice.ts
    │       ├── configSlice.ts
    │       ├── filtersSlice.ts
    │       ├── memoriesSlice.ts
    │       ├── profileSlice.ts
    │       ├── store.ts
    │       └── uiSlice.ts
    │   ├── styles
    │       ├── animation.css
    │       ├── globals.css
    │       └── notfound.scss
    │   ├── tailwind.config.ts
    │   └── tsconfig.json
├── poetry.lock
├── pyproject.toml
├── server
    ├── .env.example
    ├── Dockerfile
    ├── Makefile
    ├── README.md
    ├── dev.Dockerfile
    ├── docker-compose.yaml
    ├── main.py
    └── requirements.txt
├── tests
    ├── __init__.py
    ├── configs
    │   └── test_prompts.py
    ├── embeddings
    │   ├── test_azure_openai_embeddings.py
    │   ├── test_gemini.py
    │   ├── test_huggingface_embeddings.py
    │   ├── test_lm_studio_embeddings.py
    │   ├── test_ollama_embeddings.py
    │   ├── test_openai_embeddings.py
    │   └── test_vertexai_embeddings.py
    ├── llms
    │   ├── test_azure_openai.py
    │   ├── test_deepseek.py
    │   ├── test_gemini_llm.py
    │   ├── test_groq.py
    │   ├── test_langchain.py
    │   ├── test_litellm.py
    │   ├── test_lm_studio.py
    │   ├── test_ollama.py
    │   ├── test_openai.py
    │   └── test_together.py
    ├── memory
    │   └── test_main.py
    ├── test_main.py
    ├── test_memory.py
    ├── test_proxy.py
    ├── test_telemetry.py
    └── vector_stores
    │   ├── test_azure_ai_search.py
    │   ├── test_chroma.py
    │   ├── test_elasticsearch.py
    │   ├── test_faiss.py
    │   ├── test_langchain_vector_store.py
    │   ├── test_mongodb.py
    │   ├── test_opensearch.py
    │   ├── test_pinecone.py
    │   ├── test_qdrant.py
    │   ├── test_supabase.py
    │   ├── test_upstash_vector.py
    │   ├── test_vertex_ai_vector_search.py
    │   └── test_weaviate.py
└── vercel-ai-sdk
    ├── .gitattributes
    ├── .gitignore
    ├── README.md
    ├── config
        └── test-config.ts
    ├── jest.config.js
    ├── nodemon.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src
        ├── index.ts
        ├── mem0-facade.ts
        ├── mem0-generic-language-model.ts
        ├── mem0-provider-selector.ts
        ├── mem0-provider.ts
        ├── mem0-types.ts
        ├── mem0-utils.ts
        ├── provider-response-provider.ts
        └── stream-utils.ts
    ├── teardown.ts
    ├── tests
        ├── generate-output.test.ts
        ├── mem0-provider-tests
        │   ├── mem0-cohere.test.ts
        │   ├── mem0-google.test.ts
        │   ├── mem0-groq.test.ts
        │   ├── mem0-openai-structured-ouput.test.ts
        │   ├── mem0-openai.test.ts
        │   └── mem0_anthropic.test.ts
        ├── mem0-toolcalls.test.ts
        ├── memory-core.test.ts
        ├── text-properties.test.ts
        └── utils-test
        │   ├── anthropic-integration.test.ts
        │   ├── cohere-integration.test.ts
        │   ├── google-integration.test.ts
        │   ├── groq-integration.test.ts
        │   └── openai-integration.test.ts
    ├── tsconfig.json
    └── tsup.config.ts


/.github/ISSUE_TEMPLATE/config.yml:
--------------------------------------------------------------------------------
1 | blank_issues_enabled: true
2 | contact_links:
3 |   - name: 1-on-1 Session
4 |     url: https://cal.com/taranjeetio/ec
5 |     about: Speak directly with Taranjeet, the founder, to discuss issues, share feedback, or explore improvements for Embedchain
6 |   - name: Discord
7 |     url: https://discord.gg/6PzXDgEjG5
8 |     about: General community discussions
9 | 


--------------------------------------------------------------------------------
/.github/ISSUE_TEMPLATE/documentation_issue.yml:
--------------------------------------------------------------------------------
 1 | name: Documentation
 2 | description: Report an issue related to the Embedchain docs.
 3 | title: "DOC: <Please write a comprehensive title after the 'DOC: ' prefix>"
 4 | 
 5 | body:
 6 | - type: textarea
 7 |   attributes:
 8 |     label: "Issue with current documentation:"
 9 |     description: >
10 |       Please make sure to leave a reference to the document/code you're
11 |       referring to.
12 | 


--------------------------------------------------------------------------------
/.github/ISSUE_TEMPLATE/feature_request.yml:
--------------------------------------------------------------------------------
 1 | name: 🚀 Feature request
 2 | description: Submit a proposal/request for a new Embedchain feature
 3 | 
 4 | body:
 5 | - type: textarea
 6 |   id: feature-request
 7 |   attributes:
 8 |     label: 🚀 The feature
 9 |     description: >
10 |       A clear and concise description of the feature proposal
11 |   validations:
12 |     required: true
13 | - type: textarea
14 |   attributes:
15 |     label: Motivation, pitch
16 |     description: >
17 |       Please outline the motivation for the proposal. Is your feature request related to a specific problem? e.g., *"I'm working on X and would like Y to be possible"*. If this is related to another GitHub issue, please link here too.
18 |   validations:
19 |     required: true
20 | - type: markdown
21 |   attributes:
22 |     value: >
23 |       Thanks for contributing 🎉!
24 | 


--------------------------------------------------------------------------------
/.pre-commit-config.yaml:
--------------------------------------------------------------------------------
 1 | repos:
 2 |   - repo: local
 3 |     hooks:
 4 |       - id: ruff
 5 |         name: Ruff
 6 |         entry: ruff check
 7 |         language: system
 8 |         types: [python]
 9 |         args: [--fix] 
10 | 
11 |       - id: isort
12 |         name: isort
13 |         entry: isort
14 |         language: system
15 |         types: [python]
16 |         args: ["--profile", "black"]
17 | 


--------------------------------------------------------------------------------
/cookbooks/helper/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/cookbooks/helper/__init__.py


--------------------------------------------------------------------------------
/docs/_snippets/get-help.mdx:
--------------------------------------------------------------------------------
 1 | <CardGroup cols={3}>
 2 |   <Card title="Discord" icon="discord" href="https://mem0.dev/DiD" color="#7289DA">
 3 |     Join our community
 4 |   </Card>
 5 |   <Card title="GitHub" icon="github" href="https://github.com/mem0ai/mem0/discussions/new?category=q-a">
 6 |     Ask questions on GitHub
 7 |   </Card>
 8 |   <Card title="Support" icon="calendar" href="https://cal.com/taranjeetio/meet">
 9 |   Talk to founders
10 |   </Card>
11 | </CardGroup>
12 | 


--------------------------------------------------------------------------------
/docs/_snippets/paper-release.mdx:
--------------------------------------------------------------------------------
1 | <Note type="info">
2 |   📢 Announcing our research paper: Mem0 achieves <strong>26%</strong> higher accuracy than OpenAI Memory, <strong>91%</strong> lower latency, and <strong>90%</strong> token savings! [Read the paper](https://mem0.ai/research) to learn how we're revolutionizing AI agent memory.
3 | </Note>


--------------------------------------------------------------------------------
/docs/api-reference/entities/delete-user.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete User'
3 | openapi: delete /v1/entities/{entity_type}/{entity_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/entities/get-users.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Users'
3 | openapi: get /v1/entities/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/add-memories.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Add Memories'
3 | openapi: post /v1/memories/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/batch-delete.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Batch Delete Memories'
3 | openapi: delete /v1/batch/
4 | ---
5 | 


--------------------------------------------------------------------------------
/docs/api-reference/memory/batch-update.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Batch Update Memories'
3 | openapi: put /v1/batch/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/create-memory-export.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Create Memory Export'
3 | openapi: post /v1/exports/
4 | ---
5 | 
6 | Submit a job to create a structured export of memories using a customizable Pydantic schema. This process may take some time to complete, especially if you’re exporting a large number of memories. You can tailor the export by applying various filters (e.g., user_id, agent_id, run_id, or session_id) and by modifying the Pydantic schema to ensure the final data matches your exact needs.
7 | 


--------------------------------------------------------------------------------
/docs/api-reference/memory/delete-memories.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Memories'
3 | openapi: delete /v1/memories/
4 | ---
5 | 


--------------------------------------------------------------------------------
/docs/api-reference/memory/delete-memory.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Memory'
3 | openapi: delete /v1/memories/{memory_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/feedback.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Feedback'
3 | openapi: post /v1/feedback/
4 | ---
5 | 


--------------------------------------------------------------------------------
/docs/api-reference/memory/get-memory-export.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Memory Export'
3 | openapi: post /v1/exports/get
4 | ---
5 | 
6 | Retrieve the latest structured memory export after submitting an export job. You can filter the export by `user_id`, `run_id`, `session_id`, or `app_id` to get the most recent export matching your filters.


--------------------------------------------------------------------------------
/docs/api-reference/memory/get-memory.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Memory'
3 | openapi: get /v1/memories/{memory_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/history-memory.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Memory History'
3 | openapi: get /v1/memories/{memory_id}/history/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/update-memory.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Update Memory'
3 | openapi: put /v1/memories/{memory_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/memory/v1-get-memories.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Memories (v1 - Deprecated)'
3 | openapi: get /v1/memories/
4 | ---
5 | 


--------------------------------------------------------------------------------
/docs/api-reference/memory/v1-search-memories.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Search Memories (v1 - Deprecated)'
3 | openapi: post /v1/memories/search/
4 | ---
5 | 


--------------------------------------------------------------------------------
/docs/api-reference/organization/add-org-member.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Add Member'
 3 | openapi: post /api/v1/orgs/organizations/{org_id}/members/
 4 | ---
 5 | 
 6 | The API provides two roles for organization members:
 7 | 
 8 | - `READER`: Allows viewing of organization resources.
 9 | - `OWNER`: Grants full administrative access to manage the organization and its resources.
10 | 


--------------------------------------------------------------------------------
/docs/api-reference/organization/create-org.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Create Organization'
3 | openapi: post /api/v1/orgs/organizations/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/delete-org-member.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Member'
3 | openapi: delete /api/v1/orgs/organizations/{org_id}/members/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/delete-org.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Organization'
3 | openapi: delete /api/v1/orgs/organizations/{org_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/get-org-members.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Members'
3 | openapi: get /api/v1/orgs/organizations/{org_id}/members/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/get-org.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Organization'
3 | openapi: get /api/v1/orgs/organizations/{org_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/get-orgs.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Organizations'
3 | openapi: get /api/v1/orgs/organizations/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/organization/update-org-member.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Update Member'
3 | openapi: put /api/v1/orgs/organizations/{org_id}/members/
4 | ---
5 | 
6 | The API provides two roles for organization members:
7 | 
8 | - `READER`: Allows viewing of organization resources.
9 | - `OWNER`: Grants full administrative access to manage the organization and its resources.


--------------------------------------------------------------------------------
/docs/api-reference/project/add-project-member.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Add Member'
 3 | openapi: post /api/v1/orgs/organizations/{org_id}/projects/{project_id}/members/
 4 | ---
 5 | 
 6 | The API provides two roles for project members:
 7 | 
 8 | - `READER`: Allows viewing of project resources.
 9 | - `OWNER`: Grants full administrative access to manage the project and its resources.
10 | 


--------------------------------------------------------------------------------
/docs/api-reference/project/create-project.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Create Project'
3 | openapi: post /api/v1/orgs/organizations/{org_id}/projects/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/delete-project-member.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Member'
3 | openapi: delete /api/v1/orgs/organizations/{org_id}/projects/{project_id}/members/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/delete-project.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Project'
3 | openapi: delete /api/v1/orgs/organizations/{org_id}/projects/{project_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/get-project-members.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Members'
3 | openapi: get /api/v1/orgs/organizations/{org_id}/projects/{project_id}/members/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/get-project.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Project'
3 | openapi: get /api/v1/orgs/organizations/{org_id}/projects/{project_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/get-projects.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Get Projects'
3 | openapi: get /api/v1/orgs/organizations/{org_id}/projects/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/project/update-project-member.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Update Member'
 3 | openapi: put /api/v1/orgs/organizations/{org_id}/projects/{project_id}/members/
 4 | ---
 5 | 
 6 | The API provides two roles for project members:
 7 | 
 8 | - `READER`: Allows viewing of project resources.
 9 | - `OWNER`: Grants full administrative access to manage the project and its resources.
10 | 


--------------------------------------------------------------------------------
/docs/api-reference/project/update-project.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Update Project'
3 | openapi: patch /api/v1/orgs/organizations/{org_id}/projects/{project_id}/
4 | ---


--------------------------------------------------------------------------------
/docs/api-reference/webhook/create-webhook.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Create Webhook'
 3 | openapi: post /api/v1/webhooks/projects/{project_id}/
 4 | ---
 5 | 
 6 | ## Create Webhook
 7 | 
 8 | Create a webhook by providing the project ID and the webhook details.
 9 | 
10 | 


--------------------------------------------------------------------------------
/docs/api-reference/webhook/delete-webhook.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 'Delete Webhook'
3 | openapi: delete /api/v1/webhooks/{webhook_id}/
4 | ---
5 | 
6 | ## Delete Webhook
7 | 
8 | Delete a webhook by providing the webhook ID.
9 | 


--------------------------------------------------------------------------------
/docs/api-reference/webhook/get-webhook.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Get Webhook'
 3 | openapi: get /api/v1/webhooks/projects/{project_id}/
 4 | ---
 5 | 
 6 | ## Get Webhook
 7 | 
 8 | Get a webhook by providing the project ID.
 9 | 
10 | 


--------------------------------------------------------------------------------
/docs/api-reference/webhook/update-webhook.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 'Update Webhook'
 3 | openapi: put /api/v1/webhooks/{webhook_id}/
 4 | ---
 5 | 
 6 | ## Update Webhook
 7 | 
 8 | Update a webhook by providing the webhook ID and the fields to update.
 9 | 
10 | 


--------------------------------------------------------------------------------
/docs/images/add_architecture.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/add_architecture.png


--------------------------------------------------------------------------------
/docs/images/banner-sm.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/banner-sm.png


--------------------------------------------------------------------------------
/docs/images/dify-mem0-integration.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/dify-mem0-integration.png


--------------------------------------------------------------------------------
/docs/images/graph-platform.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph-platform.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example1.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example1.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example2.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example2.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example3.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example3.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example4.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example4.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example5.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example5.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example6.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example6.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example7.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example7.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example8.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example8.png


--------------------------------------------------------------------------------
/docs/images/graph_memory/graph_example9.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/graph_memory/graph_example9.png


--------------------------------------------------------------------------------
/docs/images/mem0-bg.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/mem0-bg.png


--------------------------------------------------------------------------------
/docs/images/platform/activity.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/platform/activity.png


--------------------------------------------------------------------------------
/docs/images/platform/api-key.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/platform/api-key.png


--------------------------------------------------------------------------------
/docs/images/playground/pg-add-memory.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/playground/pg-add-memory.png


--------------------------------------------------------------------------------
/docs/images/playground/pg-retrieve-memory.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/playground/pg-retrieve-memory.png


--------------------------------------------------------------------------------
/docs/images/rest-api-server.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/rest-api-server.png


--------------------------------------------------------------------------------
/docs/images/search_architecture.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/images/search_architecture.png


--------------------------------------------------------------------------------
/docs/knowledge-base/introduction.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: Introduction
3 | description: A collection of answers to Frequently asked questions about Mem0.
4 | ---
5 | 
6 | Coming soon.


--------------------------------------------------------------------------------
/docs/logo/favicon.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/docs/logo/favicon.png


--------------------------------------------------------------------------------
/docs/snippets/snippet-intro.mdx:
--------------------------------------------------------------------------------
1 | One of the core principles of software development is DRY (Don't Repeat
2 | Yourself). This is a principle that applies to documentation as
3 | well. If you find yourself repeating the same content in multiple places, you
4 | should consider creating a custom snippet to keep your content in sync.
5 | 


--------------------------------------------------------------------------------
/embedchain/CITATION.cff:
--------------------------------------------------------------------------------
1 | cff-version: 1.2.0
2 | message: "If you use this software, please cite it as below."
3 | authors:
4 | - family-names: "Singh"
5 |   given-names: "Taranjeet"
6 | title: "Embedchain"
7 | date-released: 2023-06-20
8 | url: "https://github.com/embedchain/embedchain"


--------------------------------------------------------------------------------
/embedchain/configs/anthropic.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: anthropic
3 |   config:
4 |     model: 'claude-instant-1'
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 |     top_p: 1
8 |     stream: false
9 | 


--------------------------------------------------------------------------------
/embedchain/configs/aws_bedrock.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: aws_bedrock
 3 |   config:
 4 |     model: amazon.titan-text-express-v1
 5 |     deployment_name: your_llm_deployment_name
 6 |     temperature: 0.5
 7 |     max_tokens: 8192
 8 |     top_p: 1
 9 |     stream: false
10 | 
11 | embedder::
12 |   provider: aws_bedrock
13 |   config:
14 |     model: amazon.titan-embed-text-v2:0
15 |     deployment_name: you_embedding_model_deployment_name


--------------------------------------------------------------------------------
/embedchain/configs/azure_openai.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: azure-openai-app
 4 | 
 5 | llm:
 6 |   provider: azure_openai
 7 |   config:
 8 |     model: gpt-35-turbo
 9 |     deployment_name: your_llm_deployment_name
10 |     temperature: 0.5
11 |     max_tokens: 1000
12 |     top_p: 1
13 |     stream: false
14 | 
15 | embedder:
16 |   provider: azure_openai
17 |   config:
18 |     model: text-embedding-ada-002
19 |     deployment_name: you_embedding_model_deployment_name
20 | 


--------------------------------------------------------------------------------
/embedchain/configs/chroma.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: 'my-app'
 4 | 
 5 | llm:
 6 |   provider: openai
 7 |   config:
 8 |     model: 'gpt-4o-mini'
 9 |     temperature: 0.5
10 |     max_tokens: 1000
11 |     top_p: 1
12 |     stream: false
13 | 
14 | vectordb:
15 |   provider: chroma
16 |   config:
17 |     collection_name: 'my-app'
18 |     dir: db
19 |     allow_reset: true
20 | 
21 | embedder:
22 |   provider: openai
23 |   config:
24 |     model: 'text-embedding-ada-002'
25 | 


--------------------------------------------------------------------------------
/embedchain/configs/chunker.yaml:
--------------------------------------------------------------------------------
1 | chunker:
2 |   chunk_size: 100
3 |   chunk_overlap: 20
4 |   length_function: 'len'
5 | 


--------------------------------------------------------------------------------
/embedchain/configs/clarifai.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: clarifai
 3 |   config: 
 4 |     model: "https://clarifai.com/mistralai/completion/models/mistral-7B-Instruct"
 5 |     model_kwargs: 
 6 |       temperature: 0.5
 7 |       max_tokens: 1000
 8 | 
 9 | embedder:
10 |   provider: clarifai
11 |   config: 
12 |     model: "https://clarifai.com/clarifai/main/models/BAAI-bge-base-en-v15"
13 | 


--------------------------------------------------------------------------------
/embedchain/configs/cohere.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: cohere
3 |   config:
4 |     model: large
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 |     top_p: 1
8 | 


--------------------------------------------------------------------------------
/embedchain/configs/google.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: google
 3 |   config:
 4 |     model: gemini-pro
 5 |     max_tokens: 1000
 6 |     temperature: 0.9
 7 |     top_p: 1.0
 8 |     stream: false
 9 | 
10 | embedder:
11 |   provider: google
12 |   config:
13 |     model: models/embedding-001
14 | 


--------------------------------------------------------------------------------
/embedchain/configs/gpt4.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: openai
3 |   config:
4 |     model: 'gpt-4'
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 |     top_p: 1
8 |     stream: false


--------------------------------------------------------------------------------
/embedchain/configs/gpt4all.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: gpt4all
 3 |   config:
 4 |     model: 'orca-mini-3b-gguf2-q4_0.gguf'
 5 |     temperature: 0.5
 6 |     max_tokens: 1000
 7 |     top_p: 1
 8 |     stream: false
 9 | 
10 | embedder:
11 |   provider: gpt4all
12 | 


--------------------------------------------------------------------------------
/embedchain/configs/huggingface.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: huggingface
3 |   config:
4 |     model: 'google/flan-t5-xxl'
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 |     top_p: 0.5
8 |     stream: false
9 | 


--------------------------------------------------------------------------------
/embedchain/configs/jina.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: jina
3 |   config:
4 |     temperature: 0.5
5 |     max_tokens: 1000
6 |     top_p: 1
7 |     stream: false
8 | 


--------------------------------------------------------------------------------
/embedchain/configs/llama2.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: llama2
3 |   config:
4 |     model: 'a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5'
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 |     top_p: 0.5
8 |     stream: false
9 | 


--------------------------------------------------------------------------------
/embedchain/configs/ollama.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: ollama
 3 |   config:
 4 |     model: 'llama2'
 5 |     temperature: 0.5
 6 |     top_p: 1
 7 |     stream: true
 8 |     base_url: http://localhost:11434
 9 | 
10 | embedder:
11 |   provider: ollama
12 |   config:
13 |     model: 'mxbai-embed-large:latest'
14 |     base_url: http://localhost:11434
15 | 


--------------------------------------------------------------------------------
/embedchain/configs/opensearch.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: 'my-app'
 4 |     log_level: 'WARNING'
 5 |     collect_metrics: true
 6 |     collection_name: 'my-app'
 7 | 
 8 | llm:
 9 |   provider: openai
10 |   config:
11 |     model: 'gpt-4o-mini'
12 |     temperature: 0.5
13 |     max_tokens: 1000
14 |     top_p: 1
15 |     stream: false
16 | 
17 | vectordb:
18 |   provider: opensearch
19 |   config:
20 |     opensearch_url: 'https://localhost:9200'
21 |     http_auth:
22 |       - admin
23 |       - admin
24 |     vector_dimension: 1536
25 |     collection_name: 'my-app'
26 |     use_ssl: false
27 |     verify_certs: false
28 | 
29 | embedder:
30 |   provider: openai
31 |   config:
32 |     model: 'text-embedding-ada-002'
33 |     deployment_name: 'my-app'
34 | 


--------------------------------------------------------------------------------
/embedchain/configs/opensource.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: 'open-source-app'
 4 |     collect_metrics: false
 5 | 
 6 | llm:
 7 |   provider: gpt4all
 8 |   config:
 9 |     model: 'orca-mini-3b-gguf2-q4_0.gguf'
10 |     temperature: 0.5
11 |     max_tokens: 1000
12 |     top_p: 1
13 |     stream: false
14 | 
15 | vectordb:
16 |   provider: chroma
17 |   config:
18 |     collection_name: 'open-source-app'
19 |     dir: db
20 |     allow_reset: true
21 | 
22 | embedder:
23 |   provider: gpt4all
24 |   config:
25 |     deployment_name: 'test-deployment'
26 | 


--------------------------------------------------------------------------------
/embedchain/configs/pinecone.yaml:
--------------------------------------------------------------------------------
1 | vectordb:
2 |   provider: pinecone
3 |   config:
4 |     metric: cosine
5 |     vector_dimension: 1536
6 |     collection_name: my-pinecone-index
7 | 


--------------------------------------------------------------------------------
/embedchain/configs/pipeline.yaml:
--------------------------------------------------------------------------------
 1 | pipeline:
 2 |   config:
 3 |     name: Example pipeline
 4 |     id: pipeline-1  # Make sure that id is different every time you create a new pipeline
 5 | 
 6 | vectordb:
 7 |   provider: chroma
 8 |   config:
 9 |     collection_name: pipeline-1
10 |     dir: db
11 |     allow_reset: true
12 | 
13 | llm:
14 |   provider: gpt4all
15 |   config:
16 |     model: 'orca-mini-3b-gguf2-q4_0.gguf'
17 |     temperature: 0.5
18 |     max_tokens: 1000
19 |     top_p: 1
20 |     stream: false
21 | 
22 | embedding_model:
23 |   provider: gpt4all
24 |   config:
25 |     model: 'all-MiniLM-L6-v2'
26 |     deployment_name: null
27 | 


--------------------------------------------------------------------------------
/embedchain/configs/together.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: together
3 |   config:
4 |     model: mistralai/Mixtral-8x7B-Instruct-v0.1
5 |     temperature: 0.5
6 |     max_tokens: 1000
7 | 


--------------------------------------------------------------------------------
/embedchain/configs/vertexai.yaml:
--------------------------------------------------------------------------------
1 | llm:
2 |   provider: vertexai
3 |   config:
4 |     model: 'chat-bison'
5 |     temperature: 0.5
6 |     top_p: 0.5
7 | 


--------------------------------------------------------------------------------
/embedchain/configs/vllm.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: vllm
 3 |   config:
 4 |     model: 'meta-llama/Llama-2-70b-hf'
 5 |     temperature: 0.5
 6 |     top_p: 1
 7 |     top_k: 10
 8 |     stream: true
 9 |     trust_remote_code: true
10 | 
11 | embedder:
12 |   provider: huggingface
13 |   config:
14 |     model: 'BAAI/bge-small-en-v1.5'
15 | 


--------------------------------------------------------------------------------
/embedchain/configs/weaviate.yaml:
--------------------------------------------------------------------------------
1 | vectordb:
2 |   provider: weaviate
3 |   config:
4 |     collection_name: my_weaviate_index
5 | 


--------------------------------------------------------------------------------
/embedchain/docs/Makefile:
--------------------------------------------------------------------------------
 1 | install:
 2 | 	npm i -g mintlify
 3 | 
 4 | run_local:
 5 | 	mintlify dev
 6 | 
 7 | troubleshoot:
 8 | 	mintlify install
 9 | 
10 | .PHONY: install run_local troubleshoot
11 | 


--------------------------------------------------------------------------------
/embedchain/docs/README.md:
--------------------------------------------------------------------------------
 1 | # Contributing to embedchain docs
 2 | 
 3 | 
 4 | ### 👩‍💻 Development
 5 | 
 6 | Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command
 7 | 
 8 | ```
 9 | npm i -g mintlify
10 | ```
11 | 
12 | Run the following command at the root of your documentation (where mint.json is)
13 | 
14 | ```
15 | mintlify dev
16 | ```
17 | 
18 | ### 😎 Publishing Changes
19 | 
20 | Changes will be deployed to production automatically after your PR is merged to the main branch.
21 | 
22 | #### Troubleshooting
23 | 
24 | - Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
25 | - Page loads as a 404 - Make sure you are running in a folder with `mint.json`
26 | 


--------------------------------------------------------------------------------
/embedchain/docs/_snippets/get-help.mdx:
--------------------------------------------------------------------------------
 1 | <CardGroup cols={3}>
 2 |   <Card title="Talk to founders" icon="calendar" href="https://cal.com/taranjeetio/ec">
 3 |   Schedule a call
 4 |   </Card>
 5 |   <Card title="Slack" icon="slack" href="https://embedchain.ai/slack" color="#4A154B">
 6 |     Join our slack community
 7 |   </Card>
 8 |   <Card title="Discord" icon="discord" href="https://discord.gg/6PzXDgEjG5" color="#7289DA">
 9 |     Join our discord community
10 |   </Card>
11 | </CardGroup>
12 | 


--------------------------------------------------------------------------------
/embedchain/docs/api-reference/app/deploy.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: 🚀 deploy
3 | ---
4 | 
5 | The `deploy()` method is currently available on an invitation-only basis. To request access, please submit your information via the provided [Google Form](https://forms.gle/vigN11h7b4Ywat668). We will review your request and respond promptly.
6 | 


--------------------------------------------------------------------------------
/embedchain/docs/api-reference/app/get.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 📄 get
 3 | ---
 4 | 
 5 | ## Get data sources
 6 | 
 7 | `get_data_sources()` returns a list of all the data sources added in the app.
 8 | 
 9 | 
10 | ### Usage
11 | 
12 | ```python
13 | from embedchain import App
14 | 
15 | app = App()
16 | 
17 | app.add("https://www.forbes.com/profile/elon-musk")
18 | app.add("https://en.wikipedia.org/wiki/Elon_Musk")
19 | 
20 | data_sources = app.get_data_sources()
21 | # [
22 | #   {
23 | #       'data_type': 'web_page',
24 | #       'data_value': 'https://en.wikipedia.org/wiki/Elon_Musk',
25 | #       'metadata': 'null'
26 | #   },
27 | #   {
28 | #       'data_type': 'web_page',
29 | #       'data_value': 'https://www.forbes.com/profile/elon-musk',
30 | #       'metadata': 'null'
31 | #   }
32 | # ]
33 | ```


--------------------------------------------------------------------------------
/embedchain/docs/api-reference/app/reset.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 🔄 reset
 3 | ---
 4 | 
 5 | `reset()` method allows you to wipe the data from your RAG application and start from scratch.
 6 | 
 7 | ## Usage
 8 | 
 9 | ```python
10 | from embedchain import App
11 | 
12 | app = App()
13 | app.add("https://www.forbes.com/profile/elon-musk")
14 | 
15 | # Reset the app
16 | app.reset()
17 | ```


--------------------------------------------------------------------------------
/embedchain/docs/api-reference/overview.mdx:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/api-reference/overview.mdx


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/audio.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: "🎤 Audio"
 3 | ---
 4 | 
 5 | 
 6 | To use an audio as data source, just add `data_type` as `audio` and pass in the path of the audio (local or hosted).
 7 | 
 8 | We use [Deepgram](https://developers.deepgram.com/docs/introduction) to transcribe the audiot to text, and then use the generated text as the data source.
 9 | 
10 | You would require an Deepgram API key which is available [here](https://console.deepgram.com/signup?jump=keys) to use this feature.
11 | 
12 | ### Without customization
13 | 
14 | ```python
15 | import os
16 | from embedchain import App
17 | 
18 | os.environ["DEEPGRAM_API_KEY"] = "153xxx"
19 | 
20 | app = App()
21 | app.add("introduction.wav", data_type="audio")
22 | response = app.query("What is my name and how old am I?")
23 | print(response)
24 | # Answer: Your name is Dave and you are 21 years old.
25 | ```
26 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/beehiiv.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: "🐝 Beehiiv"
 3 | ---
 4 | 
 5 | To add any Beehiiv data sources to your app, just add the base url as the source and set the data_type to `beehiiv`.
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | 
12 | # source: just add the base url and set the data_type to 'beehiiv'
13 | app.add('https://aibreakfast.beehiiv.com', data_type='beehiiv')
14 | app.query("How much is OpenAI paying developers?")
15 | # Answer: OpenAI is aggressively recruiting Google's top AI researchers with offers ranging between $5 to $10 million annually, primarily in stock options.
16 | ```
17 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/csv.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📊 CSV'
 3 | ---
 4 | 
 5 | You can load any csv file from your local file system or through a URL. Headers are included for each line, so if you have an `age` column, `18` will be added as `age: 18`.
 6 | 
 7 | ## Usage
 8 | 
 9 | ### Load from a local file
10 | 
11 | ```python
12 | from embedchain import App
13 | app = App()
14 | app.add('/path/to/file.csv', data_type='csv')
15 | ```
16 | 
17 | ### Load from URL
18 | 
19 | ```python
20 | from embedchain import App
21 | app = App()
22 | app.add('https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv', data_type="csv")
23 | ```
24 | 
25 | <Note>
26 | There is a size limit allowed for csv file beyond which it can throw error. This limit is set by the LLMs. Please consider chunking large csv files into smaller csv files.
27 | </Note>
28 | 
29 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/discord.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: "💬 Discord"
 3 | ---
 4 | 
 5 | To add any Discord channel messages to your app, just add the `channel_id` as the source and set the `data_type` to `discord`.
 6 | 
 7 | <Note>
 8 |     This loader requires a Discord bot token with read messages access.
 9 |     To obtain the token, follow the instructions provided in this tutorial: 
10 |     <a href="https://www.writebots.com/discord-bot-token/">How to Get a Discord Bot Token?</a>.
11 | </Note>
12 | 
13 | ```python
14 | import os
15 | from embedchain import App
16 | 
17 | # add your discord "BOT" token
18 | os.environ["DISCORD_TOKEN"] = "xxx"
19 | 
20 | app = App()
21 | 
22 | app.add("1177296711023075338", data_type="discord")
23 | 
24 | response = app.query("What is Joe saying about Elon Musk?")
25 | 
26 | print(response)
27 | # Answer: Joe is saying "Elon Musk is a genius".
28 | ```
29 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/docs-site.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📚 Code Docs website'
 3 | ---
 4 | 
 5 | To add any code documentation website as a loader, use the data_type as `docs_site`. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | app.add("https://docs.embedchain.ai/", data_type="docs_site")
12 | app.query("What is Embedchain?")
13 | # Answer: Embedchain is a platform that utilizes various components, including paid/proprietary ones, to provide what is believed to be the best configuration available. It uses LLM (Language Model) providers such as OpenAI, Anthpropic, Vertex_AI, GPT4ALL, Azure_OpenAI, LLAMA2, JINA, Ollama, Together and COHERE. Embedchain allows users to import and utilize these LLM providers for their applications.'
14 | ```
15 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/docx.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📄 Docx file'
 3 | ---
 4 | 
 5 | ### Docx file
 6 | 
 7 | To add any doc/docx file, use the data_type as `docx`. `docx` allows remote urls and conventional file paths. Eg:
 8 | 
 9 | ```python
10 | from embedchain import App
11 | 
12 | app = App()
13 | app.add('https://example.com/content/intro.docx', data_type="docx")
14 | # Or add file using the local file path on your system
15 | # app.add('content/intro.docx', data_type="docx")
16 | 
17 | app.query("Summarize the docx data?")
18 | ```
19 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/excel-file.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📄 Excel file'
 3 | ---
 4 | 
 5 | ### Excel file
 6 | 
 7 | To add any xlsx/xls file, use the data_type as `excel_file`. `excel_file` allows remote urls and conventional file paths. Eg:
 8 | 
 9 | ```python
10 | from embedchain import App
11 | 
12 | app = App()
13 | app.add('https://example.com/content/intro.xlsx', data_type="excel_file")
14 | # Or add file using the local file path on your system
15 | # app.add('content/intro.xls', data_type="excel_file")
16 | 
17 | app.query("Give brief information about data.")
18 | ```
19 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/mdx.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📝 Mdx file'
 3 | ---
 4 | 
 5 | To add any `.mdx` file to your app, use the data_type (first argument to `.add()` method) as `mdx`. Note that this supports support mdx file present on machine, so this should be a file path. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | app.add('path/to/file.mdx', data_type='mdx')
12 | 
13 | app.query("What are the docs about?")
14 | ```
15 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/notion.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📓 Notion'
 3 | ---
 4 | 
 5 | To use notion you must install the extra dependencies with `pip install --upgrade embedchain[community]`.
 6 | 
 7 | To load a notion page, use the data_type as `notion`. Since it is hard to automatically detect, it is advised to specify the `data_type` when adding a notion document.
 8 | The next argument must **end** with the `notion page id`. The id is a 32-character string. Eg:
 9 | 
10 | ```python
11 | from embedchain import App
12 | 
13 | app = App()
14 | 
15 | app.add("cfbc134ca6464fc980d0391613959196", data_type="notion")
16 | app.add("my-page-cfbc134ca6464fc980d0391613959196", data_type="notion")
17 | app.add("https://www.notion.so/my-page-cfbc134ca6464fc980d0391613959196", data_type="notion")
18 | 
19 | app.query("Summarize the notion doc")
20 | ```
21 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/qna.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '❓💬 Question and answer pair'
 3 | ---
 4 | 
 5 | QnA pair is a local data type. To supply your own QnA pair, use the data_type as `qna_pair` and enter a tuple. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | 
12 | app.add(("Question", "Answer"), data_type="qna_pair")
13 | ```
14 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/sitemap.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '🗺️ Sitemap'
 3 | ---
 4 | 
 5 | Add all web pages from an xml-sitemap. Filters non-text files. Use the data_type as `sitemap`. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | 
12 | app.add('https://example.com/sitemap.xml', data_type='sitemap')
13 | ```


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/substack.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: "📝 Substack"
 3 | ---
 4 | 
 5 | To add any Substack data sources to your app, just add the main base url as the source and set the data_type to `substack`.
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | 
12 | # source: for any substack just add the root URL
13 | app.add('https://www.lennysnewsletter.com', data_type='substack')
14 | app.query("Who is Brian Chesky?")
15 | # Answer: Brian Chesky is the co-founder and CEO of Airbnb.
16 | ```
17 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/text-file.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📄 Text file'
 3 | ---
 4 | 
 5 | To add a .txt file, specify the data_type as `text_file`. The URL provided in the first parameter of the `add` function, should be a local path. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | app.add('path/to/file.txt', data_type="text_file")
12 | 
13 | app.query("Summarize the information of the text file")
14 | ```


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/text.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📝 Text'
 3 | ---
 4 | 
 5 | ### Text
 6 | 
 7 | Text is a local data type. To supply your own text, use the data_type as `text` and enter a string. The text is not processed, this can be very versatile. Eg:
 8 | 
 9 | ```python
10 | from embedchain import App
11 | 
12 | app = App()
13 | 
14 | app.add('Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.', data_type='text')
15 | ```
16 | 
17 | Note: This is not used in the examples because in most cases you will supply a whole paragraph or file, which did not fit.
18 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/web-page.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '🌐 HTML Web page'
 3 | ---
 4 | 
 5 | To add any web page, use the data_type as `web_page`. Eg:
 6 | 
 7 | ```python
 8 | from embedchain import App
 9 | 
10 | app = App()
11 | 
12 | app.add('a_valid_web_page_url', data_type='web_page')
13 | ```
14 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/xml.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '🧾 XML file'
 3 | ---
 4 | 
 5 | ### XML file
 6 | 
 7 | To add any xml file, use the data_type as `xml`. Eg:
 8 | 
 9 | ```python
10 | from embedchain import App
11 | 
12 | app = App()
13 | 
14 | app.add('content/data.xml')
15 | ```
16 | 
17 | Note: Only the text content of the xml file will be added to the app. The tags will be ignored.
18 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/youtube-channel.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📽️ Youtube Channel'
 3 | ---
 4 | 
 5 | ## Setup
 6 | 
 7 | Make sure you have all the required packages installed before using this data type. You can install them by running the following command in your terminal.
 8 | 
 9 | ```bash
10 | pip install -U "embedchain[youtube]"
11 | ```
12 | 
13 | ## Usage
14 | 
15 | To add all the videos from a youtube channel to your app, use the data_type as `youtube_channel`.
16 | 
17 | ```python
18 | from embedchain import App
19 | 
20 | app = App()
21 | app.add("@channel_name", data_type="youtube_channel")
22 | ```
23 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/data-sources/youtube-video.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: '📺 Youtube Video'
 3 | ---
 4 | 
 5 | ## Setup
 6 | 
 7 | Make sure you have all the required packages installed before using this data type. You can install them by running the following command in your terminal.
 8 | 
 9 | ```bash
10 | pip install -U "embedchain[youtube]"
11 | ```
12 | 
13 | ## Usage
14 | 
15 | To add any youtube video to your app, use the data_type as `youtube_video`. Eg:
16 | 
17 | ```python
18 | from embedchain import App
19 | 
20 | app = App()
21 | app.add('a_valid_youtube_url_here', data_type='youtube_video')
22 | ```
23 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/introduction.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 🧩 Introduction
 3 | ---
 4 | 
 5 | ## Overview
 6 | 
 7 | You can configure following components
 8 | 
 9 | * [Data Source](/components/data-sources/overview)
10 | * [LLM](/components/llms)
11 | * [Embedding Model](/components/embedding-models)
12 | * [Vector Database](/components/vector-databases)
13 | * [Evaluation](/components/evaluation)
14 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/retrieval-methods.mdx:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/components/retrieval-methods.mdx


--------------------------------------------------------------------------------
/embedchain/docs/components/vector-databases.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 🗄️ Vector databases
 3 | ---
 4 | 
 5 | ## Overview
 6 | 
 7 | Utilizing a vector database alongside Embedchain is a seamless process. All you need to do is configure it within the YAML configuration file. We've provided examples for each supported database below:
 8 | 
 9 | <CardGroup cols={4}>
10 |   <Card title="ChromaDB" href="#chromadb"></Card>
11 |   <Card title="Elasticsearch" href="#elasticsearch"></Card>
12 |   <Card title="OpenSearch" href="#opensearch"></Card>
13 |   <Card title="Zilliz" href="#zilliz"></Card>
14 |   <Card title="LanceDB" href="#lancedb"></Card>
15 |   <Card title="Pinecone" href="#pinecone"></Card>
16 |   <Card title="Qdrant" href="#qdrant"></Card>
17 |   <Card title="Weaviate" href="#weaviate"></Card>
18 | </CardGroup>
19 | 
20 | <Snippet file="missing-vector-db-tip.mdx" />
21 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/vector-databases/chromadb.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: ChromaDB
 3 | ---
 4 | 
 5 | <CodeGroup>
 6 | 
 7 | ```python main.py
 8 | from embedchain import App
 9 | 
10 | # load chroma configuration from yaml file
11 | app = App.from_config(config_path="config1.yaml")
12 | ```
13 | 
14 | ```yaml config1.yaml
15 | vectordb:
16 |   provider: chroma
17 |   config:
18 |     collection_name: 'my-collection'
19 |     dir: db
20 |     allow_reset: true
21 | ```
22 | 
23 | ```yaml config2.yaml
24 | vectordb:
25 |   provider: chroma
26 |   config:
27 |     collection_name: 'my-collection'
28 |     host: localhost
29 |     port: 5200
30 |     allow_reset: true
31 | ```
32 | 
33 | </CodeGroup>
34 | 
35 | <Snippet file="missing-vector-db-tip.mdx" />
36 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/vector-databases/opensearch.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: OpenSearch
 3 | ---
 4 | 
 5 | Install related dependencies using the following command:
 6 | 
 7 | ```bash
 8 | pip install --upgrade 'embedchain[opensearch]'
 9 | ```
10 | 
11 | <CodeGroup>
12 | 
13 | ```python main.py
14 | from embedchain import App
15 | 
16 | # load opensearch configuration from yaml file
17 | app = App.from_config(config_path="config.yaml")
18 | ```
19 | 
20 | ```yaml config.yaml
21 | vectordb:
22 |   provider: opensearch
23 |   config:
24 |     collection_name: 'my-app'
25 |     opensearch_url: 'https://localhost:9200'
26 |     http_auth:
27 |       - admin
28 |       - admin
29 |     vector_dimension: 1536
30 |     use_ssl: false
31 |     verify_certs: false
32 | ```
33 | 
34 | </CodeGroup>
35 | 
36 | <Snippet file="missing-vector-db-tip.mdx" />
37 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/vector-databases/qdrant.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: Qdrant
 3 | ---
 4 | 
 5 | In order to use Qdrant as a vector database, set the environment variables `QDRANT_URL` and `QDRANT_API_KEY` which you can find on [Qdrant Dashboard](https://cloud.qdrant.io/).
 6 | 
 7 | <CodeGroup>
 8 | ```python main.py
 9 | from embedchain import App
10 | 
11 | # load qdrant configuration from yaml file
12 | app = App.from_config(config_path="config.yaml")
13 | ```
14 | 
15 | ```yaml config.yaml
16 | vectordb:
17 |   provider: qdrant
18 |   config:
19 |     collection_name: my_qdrant_index
20 | ```
21 | </CodeGroup>
22 | 
23 | <Snippet file="missing-vector-db-tip.mdx" />
24 | 


--------------------------------------------------------------------------------
/embedchain/docs/components/vector-databases/weaviate.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: Weaviate
 3 | ---
 4 | 
 5 | 
 6 | In order to use Weaviate as a vector database, set the environment variables `WEAVIATE_ENDPOINT` and `WEAVIATE_API_KEY` which you can find on [Weaviate dashboard](https://console.weaviate.cloud/dashboard).
 7 | 
 8 | <CodeGroup>
 9 | ```python main.py
10 | from embedchain import App
11 | 
12 | # load weaviate configuration from yaml file
13 | app = App.from_config(config_path="config.yaml")
14 | ```
15 | 
16 | ```yaml config.yaml
17 | vectordb:
18 |   provider: weaviate
19 |   config:
20 |     collection_name: my_weaviate_index
21 | ```
22 | </CodeGroup>
23 | 
24 | <Snippet file="missing-vector-db-tip.mdx" />
25 | 


--------------------------------------------------------------------------------
/embedchain/docs/contribution/guidelines.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: '📋 Guidelines'
3 | url: https://github.com/mem0ai/mem0/blob/main/embedchain/CONTRIBUTING.md
4 | ---


--------------------------------------------------------------------------------
/embedchain/docs/contribution/python.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: '🐍 Python'
3 | url: https://github.com/embedchain/embedchain
4 | ---


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/add-data.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: post /{app_id}/add
 3 | ---
 4 | 
 5 | <RequestExample>
 6 | 
 7 | ```bash Request
 8 | curl --request POST \
 9 |   --url http://localhost:8080/{app_id}/add \
10 |   -d "source=https://www.forbes.com/profile/elon-musk" \
11 |   -d "data_type=web_page"
12 | ```
13 | 
14 | </RequestExample>
15 | 
16 | <ResponseExample>
17 | 
18 | ```json Response
19 | { "response": "fec7fe91e6b2d732938a2ec2e32bfe3f" }
20 | ```
21 | 
22 | </ResponseExample>
23 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/chat.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | openapi: post /{app_id}/chat
3 | ---


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/check-status.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: get /ping
 3 | ---
 4 | 
 5 | <RequestExample>
 6 | 
 7 | ```bash Request
 8 |   curl --request GET \
 9 |     --url http://localhost:8080/ping
10 | ```
11 | 
12 | </RequestExample>
13 | 
14 | <ResponseExample>
15 | 
16 | ```json Response
17 | { "ping": "pong" }
18 | ```
19 | 
20 | </ResponseExample>
21 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/delete.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: delete /{app_id}/delete
 3 | ---
 4 | 
 5 | 
 6 | <RequestExample>
 7 | 
 8 | ```bash Request
 9 |   curl --request DELETE \
10 |     --url http://localhost:8080/{app_id}/delete
11 | ```
12 | 
13 | </RequestExample>
14 | 
15 | <ResponseExample>
16 | 
17 | ```json Response
18 | { "response": "App with id {app_id} deleted successfully." }
19 | ```
20 | 
21 | </ResponseExample>
22 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/deploy.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: post /{app_id}/deploy
 3 | ---
 4 | 
 5 | 
 6 | <RequestExample>
 7 | 
 8 | ```bash Request
 9 | curl --request POST \
10 |   --url http://localhost:8080/{app_id}/deploy \
11 |   -d "api_key=ec-xxxx"
12 | ```
13 | 
14 | </RequestExample>
15 | 
16 | <ResponseExample>
17 | 
18 | ```json Response
19 | { "response": "App deployed successfully." }
20 | ```
21 | 
22 | </ResponseExample>
23 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/get-all-apps.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: get /apps
 3 | ---
 4 | 
 5 | <RequestExample>
 6 | 
 7 | ```bash Request
 8 | curl --request GET \
 9 |   --url http://localhost:8080/apps
10 | ```
11 | 
12 | </RequestExample>
13 | 
14 | <ResponseExample>
15 | 
16 | ```json Response
17 | {
18 |   "results": [
19 |     {
20 |       "config": "config1.yaml",
21 |       "id": 1,
22 |       "app_id": "app1"
23 |     },
24 |     {
25 |       "config": "config2.yaml",
26 |       "id": 2,
27 |       "app_id": "app2"
28 |     }
29 |   ]
30 | }
31 | ```
32 | 
33 | </ResponseExample>
34 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/get-data.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: get /{app_id}/data
 3 | ---
 4 | 
 5 | <RequestExample>
 6 | 
 7 | ```bash Request
 8 | curl --request GET \
 9 |   --url http://localhost:8080/{app_id}/data
10 | ```
11 | 
12 | </RequestExample>
13 | 
14 | <ResponseExample>
15 | 
16 | ```json Response
17 | {
18 |   "results": [
19 |     {
20 |       "data_type": "web_page",
21 |       "data_value": "https://www.forbes.com/profile/elon-musk/",
22 |       "metadata": "null"
23 |     }
24 |   ]
25 | }
26 | ```
27 | 
28 | </ResponseExample>
29 | 


--------------------------------------------------------------------------------
/embedchain/docs/examples/rest-api/query.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | openapi: post /{app_id}/query
 3 | ---
 4 | 
 5 | <RequestExample>
 6 | 
 7 | ```bash Request
 8 | curl --request POST \
 9 |   --url http://localhost:8080/{app_id}/query \
10 |   -d "query=who is Elon Musk?"
11 | ```
12 | 
13 | </RequestExample>
14 | 
15 | <ResponseExample>
16 | 
17 | ```json Response
18 | { "response": "Net worth of Elon Musk is $218 Billion." }
19 | ```
20 | 
21 | </ResponseExample>
22 | 


--------------------------------------------------------------------------------
/embedchain/docs/favicon.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/favicon.png


--------------------------------------------------------------------------------
/embedchain/docs/get-started/integrations.mdx:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/get-started/integrations.mdx


--------------------------------------------------------------------------------
/embedchain/docs/images/checks-passed.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/checks-passed.png


--------------------------------------------------------------------------------
/embedchain/docs/images/cover.gif:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/cover.gif


--------------------------------------------------------------------------------
/embedchain/docs/images/fly_io.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/fly_io.png


--------------------------------------------------------------------------------
/embedchain/docs/images/fullstack-api-server.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/fullstack-api-server.png


--------------------------------------------------------------------------------
/embedchain/docs/images/fullstack-chunks.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/fullstack-chunks.png


--------------------------------------------------------------------------------
/embedchain/docs/images/fullstack.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/fullstack.png


--------------------------------------------------------------------------------
/embedchain/docs/images/gradio_app.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/gradio_app.png


--------------------------------------------------------------------------------
/embedchain/docs/images/helicone-embedchain.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/helicone-embedchain.png


--------------------------------------------------------------------------------
/embedchain/docs/images/langsmith.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/langsmith.png


--------------------------------------------------------------------------------
/embedchain/docs/images/og.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/og.png


--------------------------------------------------------------------------------
/embedchain/docs/images/slack-ai.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/slack-ai.png


--------------------------------------------------------------------------------
/embedchain/docs/images/whatsapp.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/images/whatsapp.jpg


--------------------------------------------------------------------------------
/embedchain/docs/product/release-notes.mdx:
--------------------------------------------------------------------------------
1 | ---
2 | title: ' 📜 Release Notes'
3 | url: https://github.com/embedchain/embedchain/releases
4 | ---


--------------------------------------------------------------------------------
/embedchain/docs/support/get-help.mdx:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/docs/support/get-help.mdx


--------------------------------------------------------------------------------
/embedchain/docs/use-cases/introduction.mdx:
--------------------------------------------------------------------------------
 1 | ---
 2 | title: 🧱 Introduction
 3 | ---
 4 | 
 5 | ## Overview
 6 | 
 7 | You can use embedchain to create the following usecases:
 8 | 
 9 | * [Chatbots](/use-cases/chatbots)
10 | * [Question Answering](/use-cases/question-answering)
11 | * [Semantic Search](/use-cases/semantic-search)


--------------------------------------------------------------------------------
/embedchain/embedchain/__init__.py:
--------------------------------------------------------------------------------
 1 | import importlib.metadata
 2 | 
 3 | __version__ = importlib.metadata.version(__package__ or __name__)
 4 | 
 5 | from embedchain.app import App  # noqa: F401
 6 | from embedchain.client import Client  # noqa: F401
 7 | from embedchain.pipeline import Pipeline  # noqa: F401
 8 | 
 9 | # Setup the user directory if doesn't exist already
10 | Client.setup()
11 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/bots/__init__.py:
--------------------------------------------------------------------------------
1 | from embedchain.bots.poe import PoeBot  # noqa: F401
2 | from embedchain.bots.whatsapp import WhatsAppBot  # noqa: F401
3 | 
4 | # TODO: fix discord import
5 | # from embedchain.bots.discord import DiscordBot
6 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/chunkers/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/chunkers/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/chunkers/openapi.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from langchain.text_splitter import RecursiveCharacterTextSplitter
 4 | 
 5 | from embedchain.chunkers.base_chunker import BaseChunker
 6 | from embedchain.config.add_config import ChunkerConfig
 7 | 
 8 | 
 9 | class OpenAPIChunker(BaseChunker):
10 |     def __init__(self, config: Optional[ChunkerConfig] = None):
11 |         if config is None:
12 |             config = ChunkerConfig(chunk_size=1000, chunk_overlap=0, length_function=len)
13 |         text_splitter = RecursiveCharacterTextSplitter(
14 |             chunk_size=config.chunk_size,
15 |             chunk_overlap=config.chunk_overlap,
16 |             length_function=config.length_function,
17 |         )
18 |         super().__init__(text_splitter)
19 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/chunkers/table.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from langchain.text_splitter import RecursiveCharacterTextSplitter
 4 | 
 5 | from embedchain.chunkers.base_chunker import BaseChunker
 6 | from embedchain.config.add_config import ChunkerConfig
 7 | 
 8 | 
 9 | class TableChunker(BaseChunker):
10 |     """Chunker for tables, for instance csv, google sheets or databases."""
11 | 
12 |     def __init__(self, config: Optional[ChunkerConfig] = None):
13 |         if config is None:
14 |             config = ChunkerConfig(chunk_size=300, chunk_overlap=0, length_function=len)
15 |         text_splitter = RecursiveCharacterTextSplitter(
16 |             chunk_size=config.chunk_size,
17 |             chunk_overlap=config.chunk_overlap,
18 |             length_function=config.length_function,
19 |         )
20 |         super().__init__(text_splitter)
21 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/__init__.py:
--------------------------------------------------------------------------------
 1 | # flake8: noqa: F401
 2 | 
 3 | from .add_config import AddConfig, ChunkerConfig
 4 | from .app_config import AppConfig
 5 | from .base_config import BaseConfig
 6 | from .cache_config import CacheConfig
 7 | from .embedder.base import BaseEmbedderConfig
 8 | from .embedder.base import BaseEmbedderConfig as EmbedderConfig
 9 | from .embedder.ollama import OllamaEmbedderConfig
10 | from .llm.base import BaseLlmConfig
11 | from .mem0_config import Mem0Config
12 | from .vector_db.chroma import ChromaDbConfig
13 | from .vector_db.elasticsearch import ElasticsearchDBConfig
14 | from .vector_db.opensearch import OpenSearchDBConfig
15 | from .vector_db.zilliz import ZillizDBConfig
16 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/base_config.py:
--------------------------------------------------------------------------------
 1 | from typing import Any
 2 | 
 3 | from embedchain.helpers.json_serializable import JSONSerializable
 4 | 
 5 | 
 6 | class BaseConfig(JSONSerializable):
 7 |     """
 8 |     Base config.
 9 |     """
10 | 
11 |     def __init__(self):
12 |         """Initializes a configuration class for a class."""
13 |         pass
14 | 
15 |     def as_dict(self) -> dict[str, Any]:
16 |         """Return config object as a dict
17 | 
18 |         :return: config object as dict
19 |         :rtype: dict[str, Any]
20 |         """
21 |         return vars(self)
22 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/embedder/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/config/embedder/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/config/embedder/google.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from embedchain.config.embedder.base import BaseEmbedderConfig
 4 | from embedchain.helpers.json_serializable import register_deserializable
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class GoogleAIEmbedderConfig(BaseEmbedderConfig):
 9 |     def __init__(
10 |         self,
11 |         model: Optional[str] = None,
12 |         deployment_name: Optional[str] = None,
13 |         vector_dimension: Optional[int] = None,
14 |         task_type: Optional[str] = None,
15 |         title: Optional[str] = None,
16 |     ):
17 |         super().__init__(model, deployment_name, vector_dimension)
18 |         self.task_type = task_type or "retrieval_document"
19 |         self.title = title or "Embeddings for Embedchain"
20 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/embedder/ollama.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from embedchain.config.embedder.base import BaseEmbedderConfig
 4 | from embedchain.helpers.json_serializable import register_deserializable
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class OllamaEmbedderConfig(BaseEmbedderConfig):
 9 |     def __init__(
10 |         self,
11 |         model: Optional[str] = None,
12 |         base_url: Optional[str] = None,
13 |         vector_dimension: Optional[int] = None,
14 |     ):
15 |         super().__init__(model=model, vector_dimension=vector_dimension)
16 |         self.base_url = base_url or "http://localhost:11434"
17 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/evaluation/__init__.py:
--------------------------------------------------------------------------------
1 | from .base import (  # noqa: F401
2 |     AnswerRelevanceConfig,
3 |     ContextRelevanceConfig,
4 |     GroundednessConfig,
5 | )
6 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/llm/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/config/llm/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/config/mem0_config.py:
--------------------------------------------------------------------------------
 1 | from typing import Any, Optional
 2 | 
 3 | from embedchain.config.base_config import BaseConfig
 4 | from embedchain.helpers.json_serializable import register_deserializable
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class Mem0Config(BaseConfig):
 9 |     def __init__(self, api_key: str, top_k: Optional[int] = 10):
10 |         self.api_key = api_key
11 |         self.top_k = top_k
12 | 
13 |     @staticmethod
14 |     def from_config(config: Optional[dict[str, Any]]):
15 |         if config is None:
16 |             return Mem0Config()
17 |         else:
18 |             return Mem0Config(
19 |                 api_key=config.get("api_key", ""),
20 |                 init_config=config.get("top_k", 10),
21 |             )
22 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/vector_db/weaviate.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from embedchain.config.vector_db.base import BaseVectorDbConfig
 4 | from embedchain.helpers.json_serializable import register_deserializable
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class WeaviateDBConfig(BaseVectorDbConfig):
 9 |     def __init__(
10 |         self,
11 |         collection_name: Optional[str] = None,
12 |         dir: Optional[str] = None,
13 |         batch_size: Optional[int] = 100,
14 |         **extra_params: dict[str, any],
15 |     ):
16 |         self.batch_size = batch_size
17 |         self.extra_params = extra_params
18 |         super().__init__(collection_name=collection_name, dir=dir)
19 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/config/vectordb/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/config/vectordb/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/constants.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | from pathlib import Path
 3 | 
 4 | ABS_PATH = os.getcwd()
 5 | HOME_DIR = os.environ.get("EMBEDCHAIN_CONFIG_DIR", str(Path.home()))
 6 | CONFIG_DIR = os.path.join(HOME_DIR, ".embedchain")
 7 | CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")
 8 | SQLITE_PATH = os.path.join(CONFIG_DIR, "embedchain.db")
 9 | 
10 | # Set the environment variable for the database URI
11 | os.environ.setdefault("EMBEDCHAIN_DB_URI", f"sqlite:///{SQLITE_PATH}")
12 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/core/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/core/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/core/db/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/core/db/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/data_formatter/__init__.py:
--------------------------------------------------------------------------------
1 | from .data_formatter import DataFormatter  # noqa: F401
2 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/fly.io/.dockerignore:
--------------------------------------------------------------------------------
1 | db/


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/fly.io/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=sk-xxx


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/fly.io/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt /app/
 6 | 
 7 | RUN pip install -r requirements.txt
 8 | 
 9 | COPY . /app
10 | 
11 | EXPOSE 8080
12 | 
13 | CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
14 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/fly.io/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.104.0
2 | uvicorn==0.23.2
3 | embedchain
4 | beautifulsoup4


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/gradio.app/app.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | 
 3 | import gradio as gr
 4 | 
 5 | from embedchain import App
 6 | 
 7 | os.environ["OPENAI_API_KEY"] = "sk-xxx"
 8 | 
 9 | app = App()
10 | 
11 | 
12 | def query(message, history):
13 |     return app.chat(message)
14 | 
15 | 
16 | demo = gr.ChatInterface(query)
17 | 
18 | demo.launch()
19 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/gradio.app/requirements.txt:
--------------------------------------------------------------------------------
1 | gradio==4.11.0
2 | embedchain
3 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/modal.com/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=sk-xxx


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/modal.com/.gitignore:
--------------------------------------------------------------------------------
1 | .env
2 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/modal.com/requirements.txt:
--------------------------------------------------------------------------------
1 | modal==0.56.4329
2 | fastapi==0.104.0
3 | uvicorn==0.23.2
4 | embedchain
5 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/render.com/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=sk-xxx


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/render.com/.gitignore:
--------------------------------------------------------------------------------
1 | .env
2 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/render.com/render.yaml:
--------------------------------------------------------------------------------
 1 | services:
 2 |   - type: web
 3 |     name: ec-render-app
 4 |     runtime: python
 5 |     repo: https://github.com/<your-username>/<repo-name>
 6 |     scaling:
 7 |       minInstances: 1
 8 |       maxInstances: 3
 9 |       targetMemoryPercent: 60 # optional if targetCPUPercent is set
10 |       targetCPUPercent: 60 # optional if targetMemory is set
11 |     buildCommand: pip install -r requirements.txt
12 |     startCommand: uvicorn app:app --host 0.0.0.0
13 |     envVars:
14 |       - key: OPENAI_API_KEY
15 |         value: sk-xxx
16 |     autoDeploy: false # optional
17 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/render.com/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.104.0
2 | uvicorn==0.23.2
3 | embedchain
4 | beautifulsoup4


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/streamlit.io/.streamlit/secrets.toml:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY="sk-xxx"
2 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/deployment/streamlit.io/requirements.txt:
--------------------------------------------------------------------------------
1 | streamlit==1.29.0
2 | embedchain
3 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/embedder/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/embedder/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/embedder/cohere.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from langchain_cohere.embeddings import CohereEmbeddings
 4 | 
 5 | from embedchain.config import BaseEmbedderConfig
 6 | from embedchain.embedder.base import BaseEmbedder
 7 | from embedchain.models import VectorDimensions
 8 | 
 9 | 
10 | class CohereEmbedder(BaseEmbedder):
11 |     def __init__(self, config: Optional[BaseEmbedderConfig] = None):
12 |         super().__init__(config=config)
13 | 
14 |         embeddings = CohereEmbeddings(model=self.config.model)
15 |         embedding_fn = BaseEmbedder._langchain_default_concept(embeddings)
16 |         self.set_embedding_fn(embedding_fn=embedding_fn)
17 | 
18 |         vector_dimension = self.config.vector_dimension or VectorDimensions.COHERE.value
19 |         self.set_vector_dimension(vector_dimension=vector_dimension)
20 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/embedder/vertexai.py:
--------------------------------------------------------------------------------
 1 | from typing import Optional
 2 | 
 3 | from langchain_google_vertexai import VertexAIEmbeddings
 4 | 
 5 | from embedchain.config import BaseEmbedderConfig
 6 | from embedchain.embedder.base import BaseEmbedder
 7 | from embedchain.models import VectorDimensions
 8 | 
 9 | 
10 | class VertexAIEmbedder(BaseEmbedder):
11 |     def __init__(self, config: Optional[BaseEmbedderConfig] = None):
12 |         super().__init__(config=config)
13 | 
14 |         embeddings = VertexAIEmbeddings(model_name=config.model)
15 |         embedding_fn = BaseEmbedder._langchain_default_concept(embeddings)
16 |         self.set_embedding_fn(embedding_fn=embedding_fn)
17 | 
18 |         vector_dimension = self.config.vector_dimension or VectorDimensions.VERTEX_AI.value
19 |         self.set_vector_dimension(vector_dimension=vector_dimension)
20 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/evaluation/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/evaluation/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/evaluation/base.py:
--------------------------------------------------------------------------------
 1 | from abc import ABC, abstractmethod
 2 | 
 3 | from embedchain.utils.evaluation import EvalData
 4 | 
 5 | 
 6 | class BaseMetric(ABC):
 7 |     """Base class for a metric.
 8 | 
 9 |     This class provides a common interface for all metrics.
10 |     """
11 | 
12 |     def __init__(self, name: str = "base_metric"):
13 |         """
14 |         Initialize the BaseMetric.
15 |         """
16 |         self.name = name
17 | 
18 |     @abstractmethod
19 |     def evaluate(self, dataset: list[EvalData]):
20 |         """
21 |         Abstract method to evaluate the dataset.
22 | 
23 |         This method should be implemented by subclasses to perform the actual
24 |         evaluation on the dataset.
25 | 
26 |         :param dataset: dataset to evaluate
27 |         :type dataset: list[EvalData]
28 |         """
29 |         raise NotImplementedError()
30 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/evaluation/metrics/__init__.py:
--------------------------------------------------------------------------------
1 | from .answer_relevancy import AnswerRelevance  # noqa: F401
2 | from .context_relevancy import ContextRelevance  # noqa: F401
3 | from .groundedness import Groundedness  # noqa: F401
4 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/helpers/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/helpers/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/llm/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/llm/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/loaders/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/loaders/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/loaders/base_loader.py:
--------------------------------------------------------------------------------
 1 | from typing import Any, Optional
 2 | 
 3 | from embedchain.helpers.json_serializable import JSONSerializable
 4 | 
 5 | 
 6 | class BaseLoader(JSONSerializable):
 7 |     def __init__(self):
 8 |         pass
 9 | 
10 |     def load_data(self, url, **kwargs: Optional[dict[str, Any]]):
11 |         """
12 |         Implemented by child classes
13 |         """
14 |         pass
15 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/loaders/local_qna_pair.py:
--------------------------------------------------------------------------------
 1 | import hashlib
 2 | 
 3 | from embedchain.helpers.json_serializable import register_deserializable
 4 | from embedchain.loaders.base_loader import BaseLoader
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class LocalQnaPairLoader(BaseLoader):
 9 |     def load_data(self, content):
10 |         """Load data from a local QnA pair."""
11 |         question, answer = content
12 |         content = f"Q: {question}\nA: {answer}"
13 |         url = "local"
14 |         metadata = {"url": url, "question": question}
15 |         doc_id = hashlib.sha256((content + url).encode()).hexdigest()
16 |         return {
17 |             "doc_id": doc_id,
18 |             "data": [
19 |                 {
20 |                     "content": content,
21 |                     "meta_data": metadata,
22 |                 }
23 |             ],
24 |         }
25 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/loaders/local_text.py:
--------------------------------------------------------------------------------
 1 | import hashlib
 2 | 
 3 | from embedchain.helpers.json_serializable import register_deserializable
 4 | from embedchain.loaders.base_loader import BaseLoader
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class LocalTextLoader(BaseLoader):
 9 |     def load_data(self, content):
10 |         """Load data from a local text file."""
11 |         url = "local"
12 |         metadata = {
13 |             "url": url,
14 |         }
15 |         doc_id = hashlib.sha256((content + url).encode()).hexdigest()
16 |         return {
17 |             "doc_id": doc_id,
18 |             "data": [
19 |                 {
20 |                     "content": content,
21 |                     "meta_data": metadata,
22 |                 }
23 |             ],
24 |         }
25 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/loaders/mdx.py:
--------------------------------------------------------------------------------
 1 | import hashlib
 2 | 
 3 | from embedchain.helpers.json_serializable import register_deserializable
 4 | from embedchain.loaders.base_loader import BaseLoader
 5 | 
 6 | 
 7 | @register_deserializable
 8 | class MdxLoader(BaseLoader):
 9 |     def load_data(self, url):
10 |         """Load data from a mdx file."""
11 |         with open(url, "r", encoding="utf-8") as infile:
12 |             content = infile.read()
13 |         metadata = {
14 |             "url": url,
15 |         }
16 |         doc_id = hashlib.sha256((content + url).encode()).hexdigest()
17 |         return {
18 |             "doc_id": doc_id,
19 |             "data": [
20 |                 {
21 |                     "content": content,
22 |                     "meta_data": metadata,
23 |                 }
24 |             ],
25 |         }
26 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/memory/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/memory/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/migrations/script.py.mako:
--------------------------------------------------------------------------------
 1 | """${message}
 2 | 
 3 | Revision ID: ${up_revision}
 4 | Revises: ${down_revision | comma,n}
 5 | Create Date: ${create_date}
 6 | 
 7 | """
 8 | from typing import Sequence, Union
 9 | 
10 | from alembic import op
11 | import sqlalchemy as sa
12 | ${imports if imports else ""}
13 | 
14 | # revision identifiers, used by Alembic.
15 | revision: str = ${repr(up_revision)}
16 | down_revision: Union[str, None] = ${repr(down_revision)}
17 | branch_labels: Union[str, Sequence[str], None] = ${repr(branch_labels)}
18 | depends_on: Union[str, Sequence[str], None] = ${repr(depends_on)}
19 | 
20 | 
21 | def upgrade() -> None:
22 |     ${upgrades if upgrades else "pass"}
23 | 
24 | 
25 | def downgrade() -> None:
26 |     ${downgrades if downgrades else "pass"}
27 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/models/__init__.py:
--------------------------------------------------------------------------------
1 | from .embedding_functions import EmbeddingFunctions  # noqa: F401
2 | from .providers import Providers  # noqa: F401
3 | from .vector_dimensions import VectorDimensions  # noqa: F401
4 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/models/embedding_functions.py:
--------------------------------------------------------------------------------
 1 | from enum import Enum
 2 | 
 3 | 
 4 | class EmbeddingFunctions(Enum):
 5 |     OPENAI = "OPENAI"
 6 |     HUGGING_FACE = "HUGGING_FACE"
 7 |     VERTEX_AI = "VERTEX_AI"
 8 |     AWS_BEDROCK = "AWS_BEDROCK"
 9 |     GPT4ALL = "GPT4ALL"
10 |     OLLAMA = "OLLAMA"
11 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/models/providers.py:
--------------------------------------------------------------------------------
 1 | from enum import Enum
 2 | 
 3 | 
 4 | class Providers(Enum):
 5 |     OPENAI = "OPENAI"
 6 |     ANTHROPHIC = "ANTHPROPIC"
 7 |     VERTEX_AI = "VERTEX_AI"
 8 |     GPT4ALL = "GPT4ALL"
 9 |     OLLAMA = "OLLAMA"
10 |     AZURE_OPENAI = "AZURE_OPENAI"
11 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/models/vector_dimensions.py:
--------------------------------------------------------------------------------
 1 | from enum import Enum
 2 | 
 3 | 
 4 | # vector length created by embedding fn
 5 | class VectorDimensions(Enum):
 6 |     GPT4ALL = 384
 7 |     OPENAI = 1536
 8 |     VERTEX_AI = 768
 9 |     HUGGING_FACE = 384
10 |     GOOGLE_AI = 768
11 |     MISTRAL_AI = 1024
12 |     NVIDIA_AI = 1024
13 |     COHERE = 384
14 |     OLLAMA = 384
15 |     AMAZON_TITAN_V1 = 1536
16 |     AMAZON_TITAN_V2 = 1024
17 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/pipeline.py:
--------------------------------------------------------------------------------
 1 | from embedchain.app import App
 2 | 
 3 | 
 4 | class Pipeline(App):
 5 |     """
 6 |     This is deprecated. Use `App` instead.
 7 |     """
 8 | 
 9 |     pass
10 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/store/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/store/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/telemetry/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/telemetry/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/utils/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/utils/__init__.py


--------------------------------------------------------------------------------
/embedchain/embedchain/utils/evaluation.py:
--------------------------------------------------------------------------------
 1 | from enum import Enum
 2 | from typing import Optional
 3 | 
 4 | from pydantic import BaseModel
 5 | 
 6 | 
 7 | class EvalMetric(Enum):
 8 |     CONTEXT_RELEVANCY = "context_relevancy"
 9 |     ANSWER_RELEVANCY = "answer_relevancy"
10 |     GROUNDEDNESS = "groundedness"
11 | 
12 | 
13 | class EvalData(BaseModel):
14 |     question: str
15 |     contexts: list[str]
16 |     answer: str
17 |     ground_truth: Optional[str] = None  # Not used as of now
18 | 


--------------------------------------------------------------------------------
/embedchain/embedchain/vectordb/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/embedchain/vectordb/__init__.py


--------------------------------------------------------------------------------
/embedchain/examples/api_server/.dockerignore:
--------------------------------------------------------------------------------
1 | __pycache__/
2 | database
3 | db
4 | pyenv
5 | venv
6 | .env
7 | .git
8 | trash_files/
9 | 


--------------------------------------------------------------------------------
/embedchain/examples/api_server/.gitignore:
--------------------------------------------------------------------------------
1 | __pycache__
2 | db
3 | database
4 | pyenv
5 | venv
6 | .env
7 | trash_files/
8 | .ideas.md


--------------------------------------------------------------------------------
/embedchain/examples/api_server/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11 AS backend
 2 | 
 3 | WORKDIR /usr/src/api
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | EXPOSE 5000
10 | 
11 | ENV FLASK_APP=api_server.py
12 | 
13 | ENV FLASK_RUN_EXTRA_FILES=/usr/src/api/*
14 | ENV FLASK_ENV=development
15 | 
16 | CMD ["flask", "run", "--host=0.0.0.0", "--reload"]
17 | 


--------------------------------------------------------------------------------
/embedchain/examples/api_server/README.md:
--------------------------------------------------------------------------------
1 | # API Server
2 | 
3 | This is a docker template to create your own API Server using the embedchain package. To know more about the API Server and how to use it, go [here](https://docs.embedchain.ai/examples/api_server).


--------------------------------------------------------------------------------
/embedchain/examples/api_server/docker-compose.yml:
--------------------------------------------------------------------------------
 1 | version: "3.9"
 2 | 
 3 | services:
 4 |   backend:
 5 |     container_name: embedchain_api
 6 |     restart: unless-stopped
 7 |     build:
 8 |       context: .
 9 |       dockerfile: Dockerfile
10 |     env_file:
11 |       - variables.env
12 |     ports:
13 |       - "5000:5000"
14 |     volumes:
15 |       - .:/usr/src/api
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/api_server/requirements.txt:
--------------------------------------------------------------------------------
 1 | flask==2.3.2
 2 | youtube-transcript-api==0.6.1 
 3 | pytube==15.0.0 
 4 | beautifulsoup4==4.12.3
 5 | slack-sdk==3.21.3
 6 | huggingface_hub==0.23.0
 7 | gitpython==3.1.38
 8 | yt_dlp==2023.11.14
 9 | PyGithub==1.59.1
10 | feedparser==6.0.10
11 | newspaper3k==0.2.8
12 | listparser==0.19


--------------------------------------------------------------------------------
/embedchain/examples/api_server/variables.env:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=""


--------------------------------------------------------------------------------
/embedchain/examples/chainlit/.gitignore:
--------------------------------------------------------------------------------
1 | .chainlit
2 | 


--------------------------------------------------------------------------------
/embedchain/examples/chainlit/README.md:
--------------------------------------------------------------------------------
 1 | ## Chainlit + Embedchain Demo
 2 | 
 3 | In this example, we will learn how to use Chainlit and Embedchain together 
 4 | 
 5 | ## Setup
 6 | 
 7 | First, install the required packages:
 8 | 
 9 | ```bash
10 | pip install -r requirements.txt
11 | ```
12 | 
13 | ## Run the app locally,
14 | 
15 | ```
16 | chainlit run app.py
17 | ```
18 | 


--------------------------------------------------------------------------------
/embedchain/examples/chainlit/chainlit.md:
--------------------------------------------------------------------------------
 1 | # Welcome to Embedchain! 🚀
 2 | 
 3 | Hello! 👋 Excited to see you join us. With Embedchain and Chainlit, create ChatGPT like apps effortlessly.
 4 | 
 5 | ## Quick Start 🌟
 6 | 
 7 | - **Embedchain Docs:** Get started with our comprehensive [Embedchain Documentation](https://docs.embedchain.ai/) 📚
 8 | - **Discord Community:** Join our discord [Embedchain Discord](https://discord.gg/CUU9FPhRNt) to ask questions, share your projects, and connect with other developers! 💬
 9 | - **UI Guide**: Master Chainlit with [Chainlit Documentation](https://docs.chainlit.io/) ⛓️
10 | 
11 | Happy building with Embedchain! 🎉
12 | 
13 | ## Customize welcome screen
14 | 
15 | Edit chainlit.md in your project root to change this welcome message.
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/chainlit/requirements.txt:
--------------------------------------------------------------------------------
1 | chainlit==0.7.700
2 | embedchain==0.1.31
3 | 


--------------------------------------------------------------------------------
/embedchain/examples/chat-pdf/embedchain.json:
--------------------------------------------------------------------------------
1 | {
2 |     "provider": "streamlit.io"
3 | }


--------------------------------------------------------------------------------
/embedchain/examples/chat-pdf/requirements.txt:
--------------------------------------------------------------------------------
1 | streamlit
2 | embedchain
3 | langchain-text-splitters
4 | pysqlite3-binary
5 | 


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/.dockerignore:
--------------------------------------------------------------------------------
1 | __pycache__/
2 | database
3 | db
4 | pyenv
5 | venv
6 | .env
7 | .git
8 | trash_files/
9 | 


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/.gitignore:
--------------------------------------------------------------------------------
1 | __pycache__
2 | db
3 | database
4 | pyenv
5 | venv
6 | .env
7 | trash_files/
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /usr/src/discord_bot
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | CMD ["python", "discord_bot.py"]
10 | 


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/README.md:
--------------------------------------------------------------------------------
 1 | # Discord Bot
 2 | 
 3 | This is a docker template to create your own Discord bot using the embedchain package. To know more about the bot and how to use it, go [here](https://docs.embedchain.ai/examples/discord_bot).
 4 | 
 5 | To run this use the following command,
 6 | 
 7 | ```bash
 8 | docker run --name discord-bot -e OPENAI_API_KEY=sk-xxx -e DISCORD_BOT_TOKEN=xxx -p 8080:8080 embedchain/discord-bot:latest
 9 | ```
10 | 


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/docker-compose.yml:
--------------------------------------------------------------------------------
 1 | version: "3.9"
 2 | 
 3 | services:
 4 |   backend:
 5 |     container_name: embedchain_discord_bot
 6 |     restart: unless-stopped
 7 |     build:
 8 |       context: .
 9 |       dockerfile: Dockerfile
10 |     env_file:
11 |       - variables.env


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/requirements.txt:
--------------------------------------------------------------------------------
1 | discord==2.3.1
2 | embedchain==0.0.58
3 | python-dotenv==1.0.0


--------------------------------------------------------------------------------
/embedchain/examples/discord_bot/variables.env:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=""
2 | DISCORD_BOT_TOKEN=""


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/.dockerignore:
--------------------------------------------------------------------------------
1 | .git
2 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/README.md:
--------------------------------------------------------------------------------
 1 | ## 🐳 Docker Setup
 2 | 
 3 | - To setup full stack app using docker, run the following command inside this folder using your terminal.
 4 | 
 5 | ```bash
 6 | docker-compose up --build
 7 | ```
 8 | 
 9 | 📝 Note: The build command might take a while to install all the packages depending on your system resources.
10 | 
11 | ## 🚀 Usage Instructions
12 | 
13 | - Go to [http://localhost:3000/](http://localhost:3000/) in your browser to view the dashboard.
14 | - Add your `OpenAI API key` 🔑 in the Settings.
15 | - Create a new bot and you'll be navigated to its page.
16 | - Here you can add your data sources and then chat with the bot.
17 | 
18 | 🎉 Happy Chatting! 🎉
19 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/.dockerignore:
--------------------------------------------------------------------------------
1 | __pycache__/
2 | database
3 | pyenv
4 | venv
5 | .env
6 | .git
7 | trash_files/
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/.gitignore:
--------------------------------------------------------------------------------
1 | __pycache__
2 | database
3 | pyenv
4 | venv
5 | .env
6 | trash_files/
7 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim AS backend
 2 | 
 3 | WORKDIR /usr/src/app/backend
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | EXPOSE 8000
10 | 
11 | CMD ["python", "server.py"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/models.py:
--------------------------------------------------------------------------------
 1 | from flask_sqlalchemy import SQLAlchemy
 2 | 
 3 | db = SQLAlchemy()
 4 | 
 5 | 
 6 | class APIKey(db.Model):
 7 |     id = db.Column(db.Integer, primary_key=True)
 8 |     key = db.Column(db.String(255), nullable=False)
 9 | 
10 | 
11 | class BotList(db.Model):
12 |     id = db.Column(db.Integer, primary_key=True)
13 |     name = db.Column(db.String(255), nullable=False)
14 |     slug = db.Column(db.String(255), nullable=False, unique=True)
15 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/paths.py:
--------------------------------------------------------------------------------
1 | import os
2 | 
3 | ROOT_DIRECTORY = os.getcwd()
4 | DB_DIRECTORY_OPEN_AI = os.path.join(os.getcwd(), "database", "open_ai")
5 | DB_DIRECTORY_OPEN_SOURCE = os.path.join(os.getcwd(), "database", "open_source")
6 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/backend/requirements.txt:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/examples/full_stack/backend/requirements.txt


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/docker-compose.yml:
--------------------------------------------------------------------------------
 1 | version: "3.9"
 2 | 
 3 | services:
 4 |   backend:
 5 |     container_name: embedchain-backend
 6 |     restart: unless-stopped
 7 |     build:
 8 |       context: backend
 9 |       dockerfile: Dockerfile
10 |     image: embedchain/backend
11 |     ports:
12 |       - "8000:8000"
13 | 
14 |   frontend:
15 |     container_name: embedchain-frontend
16 |     restart: unless-stopped
17 |     build:
18 |       context: frontend
19 |       dockerfile: Dockerfile
20 |     image: embedchain/frontend
21 |     ports:
22 |       - "3000:3000"
23 |     depends_on:
24 |       - "backend"
25 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/.dockerignore:
--------------------------------------------------------------------------------
1 | node_modules/
2 | build
3 | dist
4 | .env
5 | .git
6 | .next/
7 | trash_files/
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/.eslintrc.json:
--------------------------------------------------------------------------------
1 | {
2 |   "extends": ["next/babel", "next/core-web-vitals"]
3 | }
4 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 | 
 3 | # dependencies
 4 | /node_modules
 5 | /.pnp
 6 | .pnp.js
 7 | 
 8 | # testing
 9 | /coverage
10 | 
11 | # next.js
12 | /.next/
13 | /out/
14 | 
15 | # production
16 | /build
17 | 
18 | # misc
19 | .DS_Store
20 | *.pem
21 | 
22 | # debug
23 | npm-debug.log*
24 | yarn-debug.log*
25 | yarn-error.log*
26 | 
27 | # local env files
28 | .env*.local
29 | 
30 | # vercel
31 | .vercel
32 | 
33 | # typescript
34 | *.tsbuildinfo
35 | next-env.d.ts
36 | 
37 | vscode/
38 | trash_files/
39 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM node:18-slim AS frontend
 2 | 
 3 | WORKDIR /usr/src/app/frontend
 4 | COPY package.json .
 5 | COPY package-lock.json .
 6 | RUN npm install
 7 | 
 8 | COPY . .
 9 | 
10 | RUN npm run build
11 | 
12 | EXPOSE 3000
13 | 
14 | CMD ["npm", "start"]
15 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/jsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 |   "compilerOptions": {
3 |     "paths": {
4 |       "@/*": ["./src/*"]
5 |     }
6 |   }
7 | }
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/next.config.js:
--------------------------------------------------------------------------------
 1 | /** @type {import('next').NextConfig} */
 2 | const nextConfig = {
 3 |   async rewrites() {
 4 |     return [
 5 |       {
 6 |         source: "/api/:path*",
 7 |         destination: "http://backend:8000/api/:path*",
 8 |       },
 9 |     ];
10 |   },
11 |   reactStrictMode: true,
12 |   experimental: {
13 |     proxyTimeout: 6000000,
14 |   },
15 |   webpack(config) {
16 |     config.module.rules.push({
17 |       test: /\.svg$/i,
18 |       issuer: /\.[jt]sx?$/,
19 |       use: ["@svgr/webpack"],
20 |     });
21 | 
22 |     return config;
23 |   },
24 | };
25 | 
26 | module.exports = nextConfig;
27 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "frontend",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "next lint"
10 |   },
11 |   "dependencies": {
12 |     "autoprefixer": "^10.4.14",
13 |     "eslint": "8.44.0",
14 |     "eslint-config-next": "13.4.9",
15 |     "flowbite": "^1.7.0",
16 |     "next": "13.4.9",
17 |     "postcss": "8.4.25",
18 |     "react": "18.2.0",
19 |     "react-dom": "18.2.0",
20 |     "tailwindcss": "3.3.2"
21 |   },
22 |   "devDependencies": {
23 |     "@svgr/webpack": "^8.0.1"
24 |   }
25 | }
26 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/postcss.config.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   plugins: {
3 |     tailwindcss: {},
4 |     autoprefixer: {},
5 |   },
6 | }
7 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/favicon.ico:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/examples/full_stack/frontend/public/favicon.ico


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/close.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 | aria-hidden="true"
 3 | xmlns="http://www.w3.org/2000/svg"
 4 | fill="none"
 5 | viewBox="0 0 14 14"
 6 | >
 7 | <path
 8 |     stroke="currentColor"
 9 |     stroke-linecap="round"
10 |     stroke-linejoin="round"
11 |     stroke-width="2"
12 |     d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
13 | />
14 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/cross.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |   fill="currentColor"
 3 |   viewBox="0 0 32 32"
 4 |   xmlns="http://www.w3.org/2000/svg"
 5 | >
 6 |   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
 7 |   <g
 8 |     id="SVGRepo_tracerCarrier"
 9 |     stroke-linecap="round"
10 |     stroke-linejoin="round"
11 |   ></g>
12 |   <g id="SVGRepo_iconCarrier">
13 |     <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"></path>
14 |   </g>
15 | </svg>
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/dashboard.svg:
--------------------------------------------------------------------------------
1 | <svg
2 |   aria-hidden="true"
3 |   xmlns="http://www.w3.org/2000/svg"
4 |   fill="currentColor"
5 |   viewBox="0 0 22 21"
6 | >
7 |   <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
8 |   <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
9 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/drawer.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |     aria-hidden="true"
 3 |     fill="currentColor"
 4 |     viewBox="0 0 20 20"
 5 |     xmlns="http://www.w3.org/2000/svg"
 6 | >
 7 |     <path
 8 |     clip-rule="evenodd"
 9 |     fill-rule="evenodd"
10 |     d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
11 |     ></path>
12 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/dropdown.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 | aria-hidden="true"
 3 | xmlns="http://www.w3.org/2000/svg"
 4 | fill="none"
 5 | viewBox="0 0 10 6"
 6 | >
 7 | <path
 8 |     stroke="currentColor"
 9 |     stroke-linecap="round"
10 |     stroke-linejoin="round"
11 |     stroke-width="2"
12 |     d="m1 1 4 4 4-4"
13 | />
14 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/dropup.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |     aria-hidden="true"
 3 |     xmlns="http://www.w3.org/2000/svg"
 4 |     fill="none"
 5 |     viewBox="0 0 10 6"
 6 | >
 7 |     <path
 8 |     stroke="currentColor"
 9 |     stroke-linecap="round"
10 |     stroke-linejoin="round"
11 |     stroke-width="2"
12 |     d="M9 5 5 1 1 5"
13 |     />
14 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/plus.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 | xmlns="http://www.w3.org/2000/svg"
 3 | fill="currentColor"
 4 | viewBox="0 0 24 24"
 5 | stroke="currentColor"
 6 | >
 7 | <path
 8 |     strokeLinecap="round"
 9 |     strokeLinejoin="round"
10 |     strokeWidth="2"
11 |     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
12 | />
13 | </svg>


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/text.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |   viewBox="0 0 24 24"
 3 |   fill="none"
 4 |   xmlns="http://www.w3.org/2000/svg"
 5 | >
 6 |   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
 7 |   <g
 8 |     id="SVGRepo_tracerCarrier"
 9 |     stroke-linecap="round"
10 |     stroke-linejoin="round"
11 |   ></g>
12 |   <g id="SVGRepo_iconCarrier">
13 |     <path
14 |       d="M12 3V21M9 21H15M19 6V3H5V6"
15 |       stroke="currentColor"
16 |       stroke-width="2"
17 |       stroke-linecap="round"
18 |       stroke-linejoin="round"
19 |     ></path>
20 |   </g>
21 | </svg>
22 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/twitter.svg:
--------------------------------------------------------------------------------
 1 | <?xml version="1.0" encoding="utf-8"?>
 2 | <!-- Generator: Adobe Illustrator 27.5.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
 3 | <svg version="1.1" id="svg5" xmlns:svg="http://www.w3.org/2000/svg"
 4 | 	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1668.56 1221.19"
 5 | 	 style="enable-background:new 0 0 1668.56 1221.19;" xml:space="preserve">
 6 | <g id="layer1" transform="translate(52.390088,-25.058597)">
 7 | 	<path id="path1009" d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99
 8 | 		h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"/>
 9 | </g>
10 | </svg>
11 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/icons/web.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |   fill="currentColor"
 3 |   version="1.1"
 4 |   id="Layer_1"
 5 |   xmlns="http://www.w3.org/2000/svg"
 6 |   xmlns:xlink="http://www.w3.org/1999/xlink"
 7 |   viewBox="0 0 24 24"
 8 |   enable-background="new 0 0 24 24"
 9 |   xml:space="preserve"
10 | >
11 |   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
12 |   <g
13 |     id="SVGRepo_tracerCarrier"
14 |     stroke-linecap="round"
15 |     stroke-linejoin="round"
16 |   ></g>
17 |   <g id="SVGRepo_iconCarrier">
18 |     <path d="M18.41,0.01H4V9h2V2.01h10v6h6v14H4v2h20V5.6L18.41,0.01z M18,2.43l3.59,3.59H18V2.43z M21,18v2h-1h-1h-1v-8h2v6H21z M7,12 H6v2h1v6h2v-6h1v-2H9H7z M15,12l-1,1.61L13,12v0h-2v8h2v-4.21l1,1.61l1-1.61V20h2v-8L15,12L15,12z M3,15H2v-3H0v8h2v-3h1v3h2v-8H3 V15z"></path>
19 |   </g>
20 | </svg>
21 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/public/images/embedchain.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/examples/full_stack/frontend/public/images/embedchain.png


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/components/PageWrapper.js:
--------------------------------------------------------------------------------
 1 | export default function PageWrapper({ children }) {
 2 |   return (
 3 |     <>
 4 |       <div className="flex pt-4 px-4 sm:ml-64 min-h-screen">
 5 |         <div className="flex-grow pt-4 px-4 rounded-lg">{children}</div>
 6 |       </div>
 7 |     </>
 8 |   );
 9 | }
10 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/components/chat/BotWrapper.js:
--------------------------------------------------------------------------------
 1 | export default function BotWrapper({ children }) {
 2 |   return (
 3 |     <>
 4 |       <div className="rounded-lg">
 5 |         <div className="flex flex-row items-center">
 6 |           <div className="flex items-center justify-center h-10 w-10 rounded-full bg-black text-white flex-shrink-0">
 7 |             B
 8 |           </div>
 9 |           <div className="ml-3 text-sm bg-white py-2 px-4 shadow-lg rounded-xl">
10 |             <div>{children}</div>
11 |           </div>
12 |         </div>
13 |       </div>
14 |     </>
15 |   );
16 | }
17 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/components/chat/HumanWrapper.js:
--------------------------------------------------------------------------------
 1 | export default function HumanWrapper({ children }) {
 2 |   return (
 3 |     <>
 4 |       <div className="rounded-lg">
 5 |         <div className="flex items-center justify-start flex-row-reverse">
 6 |           <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-800 text-white flex-shrink-0">
 7 |             H
 8 |           </div>
 9 |           <div className="mr-3 text-sm bg-blue-200 py-2 px-4 shadow-lg rounded-xl">
10 |             <div>{children}</div>
11 |           </div>
12 |         </div>
13 |       </div>
14 |     </>
15 |   );
16 | }
17 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/pages/[bot_slug]/app.js:
--------------------------------------------------------------------------------
 1 | import Wrapper from "@/components/PageWrapper";
 2 | import Sidebar from "@/containers/Sidebar";
 3 | import ChatWindow from "@/containers/ChatWindow";
 4 | import { useState } from "react";
 5 | import Head from "next/head";
 6 | 
 7 | export default function App() {
 8 |   const [botTitle, setBotTitle] = useState("");
 9 | 
10 |   return (
11 |     <>
12 |       <Head>
13 |         <title>{botTitle}</title>
14 |       </Head>
15 |       <Sidebar />
16 |       <Wrapper>
17 |         <ChatWindow
18 |           embedding_model="open_ai"
19 |           app_type="app"
20 |           setBotTitle={setBotTitle}
21 |         />
22 |       </Wrapper>
23 |     </>
24 |   );
25 | }
26 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/pages/_app.js:
--------------------------------------------------------------------------------
 1 | import "@/styles/globals.css";
 2 | import Script from "next/script";
 3 | 
 4 | export default function App({ Component, pageProps }) {
 5 |   return (
 6 |     <>
 7 |       <Script
 8 |         src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js"
 9 |         strategy="beforeInteractive"
10 |       />
11 |       <Component {...pageProps} />
12 |     </>
13 |   );
14 | }
15 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/pages/_document.js:
--------------------------------------------------------------------------------
 1 | import { Html, Head, Main, NextScript } from "next/document";
 2 | 
 3 | export default function Document() {
 4 |   return (
 5 |     <Html lang="en">
 6 |       <Head>
 7 |         <link
 8 |           href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.css"
 9 |           rel="stylesheet"
10 |         />
11 |       </Head>
12 |       <body>
13 |         <Main />
14 |         <NextScript />
15 |       </body>
16 |     </Html>
17 |   );
18 | }
19 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/src/styles/globals.css:
--------------------------------------------------------------------------------
1 | @tailwind base;
2 | @tailwind components;
3 | @tailwind utilities;
4 | 


--------------------------------------------------------------------------------
/embedchain/examples/full_stack/frontend/tailwind.config.js:
--------------------------------------------------------------------------------
 1 | /** @type {import('tailwindcss').Config} */
 2 | module.exports = {
 3 |   content: [
 4 |     "./src/**/*.{js,ts,jsx,tsx,mdx}",
 5 |     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
 6 |     "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
 7 |     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
 8 |     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
 9 |     "./node_modules/flowbite/**/*.js",
10 |   ],
11 |   theme: {
12 |     extend: {},
13 |   },
14 |   plugins: [require("flowbite/plugin")],
15 | };
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/mistral-streamlit/README.md:
--------------------------------------------------------------------------------
1 | ### Streamlit Chat bot App (Embedchain + Mistral)
2 | 
3 | To run it locally,
4 | 
5 | ```bash
6 | streamlit run app.py
7 | ```
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/mistral-streamlit/config.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     name: 'mistral-streamlit-app'
 4 | 
 5 | llm:
 6 |   provider: huggingface
 7 |   config:
 8 |     model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
 9 |     temperature: 0.1
10 |     max_tokens: 250
11 |     top_p: 0.1
12 |     stream: true
13 | 
14 | embedder:
15 |   provider: huggingface
16 |   config:
17 |     model: 'sentence-transformers/all-mpnet-base-v2'
18 | 


--------------------------------------------------------------------------------
/embedchain/examples/mistral-streamlit/requirements.txt:
--------------------------------------------------------------------------------
1 | streamlit==1.29.0
2 | embedchain
3 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/.dockerignore:
--------------------------------------------------------------------------------
1 | db/


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=sk-xxx


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt /app/
 6 | 
 7 | RUN pip install -r requirements.txt
 8 | 
 9 | COPY . /app
10 | 
11 | EXPOSE 8080
12 | 
13 | CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
14 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/embedchain.json:
--------------------------------------------------------------------------------
1 | {
2 |     "provider": "fly.io"
3 | }


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/fly.toml:
--------------------------------------------------------------------------------
 1 | # fly.toml app configuration file generated for ec-app-crimson-dew-123 on 2024-01-04T06:48:40+05:30
 2 | #
 3 | # See https://fly.io/docs/reference/configuration/ for information about how to use this file.
 4 | #
 5 | 
 6 | app = "ec-app-crimson-dew-123"
 7 | primary_region = "sjc"
 8 | 
 9 | [build]
10 | 
11 | [http_service]
12 |   internal_port = 8080
13 |   force_https = true
14 |   auto_stop_machines = false
15 |   auto_start_machines = true
16 |   min_machines_running = 0
17 |   processes = ["app"]
18 | 
19 | [[vm]]
20 |   cpu_kind = "shared"
21 |   cpus = 1
22 |   memory_mb = 1024
23 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/ec_app/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.104.0
2 | uvicorn==0.23.2
3 | embedchain
4 | beautifulsoup4


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/.dockerignore:
--------------------------------------------------------------------------------
1 | db/


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/.env.example:
--------------------------------------------------------------------------------
1 | DISCORD_BOT_TOKEN=xxxx
2 | DISCORD_BOT_NAME=your_bot_name
3 | EC_APP_URL=your_embedchain_app_url


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt /app
 6 | 
 7 | RUN pip install -r requirements.txt
 8 | 
 9 | COPY . /app
10 | 
11 | CMD ["python", "app.py"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/embedchain.json:
--------------------------------------------------------------------------------
1 | {
2 |     "provider": "fly.io"
3 | }


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/fly.toml:
--------------------------------------------------------------------------------
 1 | # fly.toml app configuration file generated for nextjs-discord on 2024-01-04T06:56:01+05:30
 2 | #
 3 | # See https://fly.io/docs/reference/configuration/ for information about how to use this file.
 4 | #
 5 | 
 6 | app = "nextjs-discord"
 7 | primary_region = "sjc"
 8 | 
 9 | [build]
10 | 
11 | [http_service]
12 |   internal_port = 8080
13 |   force_https = true
14 |   auto_stop_machines = true
15 |   auto_start_machines = true
16 |   min_machines_running = 0
17 |   processes = ["app"]
18 | 
19 | [[vm]]
20 |   cpu_kind = "shared"
21 |   cpus = 1
22 |   memory_mb = 1024
23 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_discord/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.104.0
2 | uvicorn==0.23.2
3 | embedchain
4 | beautifulsoup4


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/.dockerignore:
--------------------------------------------------------------------------------
1 | db/


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/.env.example:
--------------------------------------------------------------------------------
1 | SLACK_APP_TOKEN=xapp-xxxx
2 | SLACK_BOT_TOKEN=xoxb-xxxx
3 | EC_APP_URL=your_embedchain_app_url


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt /app
 6 | 
 7 | RUN pip install -r requirements.txt
 8 | 
 9 | COPY . /app
10 | 
11 | CMD ["python", "app.py"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/embedchain.json:
--------------------------------------------------------------------------------
1 | {
2 |     "provider": "fly.io"
3 | }


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/fly.toml:
--------------------------------------------------------------------------------
 1 | # fly.toml app configuration file generated for nextjs-slack on 2024-01-05T09:33:59+05:30
 2 | #
 3 | # See https://fly.io/docs/reference/configuration/ for information about how to use this file.
 4 | #
 5 | 
 6 | app = "nextjs-slack"
 7 | primary_region = "sjc"
 8 | 
 9 | [build]
10 | 
11 | [http_service]
12 |   internal_port = 8080
13 |   force_https = true
14 |   auto_stop_machines = false
15 |   auto_start_machines = true
16 |   min_machines_running = 0
17 |   processes = ["app"]
18 | 
19 | [[vm]]
20 |   cpu_kind = "shared"
21 |   cpus = 1
22 |   memory_mb = 1024
23 | 


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/nextjs_slack/requirements.txt:
--------------------------------------------------------------------------------
1 | python-dotenv
2 | slack-sdk
3 | slack_bolt
4 | embedchain


--------------------------------------------------------------------------------
/embedchain/examples/nextjs/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.104.0
2 | uvicorn==0.23.2
3 | embedchain[opensource]
4 | beautifulsoup4
5 | discord
6 | python-dotenv
7 | slack-sdk
8 | slack_bolt
9 | 


--------------------------------------------------------------------------------
/embedchain/examples/private-ai/README.md:
--------------------------------------------------------------------------------
 1 | # Private AI
 2 | 
 3 | In this example, we will create a private AI using embedchain.
 4 | 
 5 | Private AI is useful when you want to chat with your data and you dont want to spend money and your data should stay on your machine.
 6 | 
 7 | ## How to install
 8 | 
 9 | First create a virtual environment and install the requirements by running
10 | 
11 | ```bash
12 | pip install -r requirements.txt
13 | ```
14 | 
15 | ## How to use
16 | 
17 | * Now open privateai.py file and change the line `app.add` to point to your directory or data source.
18 | * If you want to add any other data type, you can browse the supported data types [here](https://docs.embedchain.ai/components/data-sources/overview)
19 | 
20 | * Now simply run the file by
21 | 
22 | ```bash
23 | python privateai.py
24 | ```
25 | 
26 | * Now you can enter and ask any questions from your data.


--------------------------------------------------------------------------------
/embedchain/examples/private-ai/config.yaml:
--------------------------------------------------------------------------------
 1 | llm:
 2 |   provider: gpt4all
 3 |   config:
 4 |     model: 'orca-mini-3b-gguf2-q4_0.gguf'
 5 |     max_tokens: 1000
 6 |     top_p: 1
 7 | embedder:
 8 |   provider: huggingface
 9 |   config:
10 |     model: 'sentence-transformers/all-MiniLM-L6-v2'


--------------------------------------------------------------------------------
/embedchain/examples/private-ai/privateai.py:
--------------------------------------------------------------------------------
 1 | from embedchain import App
 2 | 
 3 | app = App.from_config("config.yaml")
 4 | app.add("/path/to/your/folder", data_type="directory")
 5 | 
 6 | while True:
 7 |     user_input = input("Enter your question (type 'exit' to quit): ")
 8 | 
 9 |     # Break the loop if the user types 'exit'
10 |     if user_input.lower() == "exit":
11 |         break
12 | 
13 |     # Process the input and provide a response
14 |     response = app.chat(user_input)
15 |     print(response)
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/private-ai/requirements.txt:
--------------------------------------------------------------------------------
1 | "embedchain[opensource]"


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/.dockerignore:
--------------------------------------------------------------------------------
1 | .env
2 | app.db
3 | configs/**.yaml
4 | db


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/.gitignore:
--------------------------------------------------------------------------------
1 | .env
2 | app.db
3 | configs/**.yaml
4 | db
5 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt /app/
 6 | 
 7 | RUN pip install --no-cache-dir -r requirements.txt
 8 | 
 9 | COPY . /app
10 | 
11 | EXPOSE 8080
12 | 
13 | ENV NAME embedchain
14 | 
15 | CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
16 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/README.md:
--------------------------------------------------------------------------------
 1 | ## Single command to rule them all,
 2 | 
 3 | ```bash
 4 | docker run -d --name embedchain -p 8080:8080 embedchain/rest-api:latest
 5 | ```
 6 | 
 7 | ### To run the app locally,
 8 | 
 9 | ```bash
10 | # will help reload on changes
11 | DEVELOPMENT=True && python -m main
12 | ```
13 | 
14 | Using docker (locally),
15 | 
16 | ```bash
17 | docker build -t embedchain/rest-api:latest .
18 | docker run -d --name embedchain -p 8080:8080 embedchain/rest-api:latest
19 | docker image push embedchain/rest-api:latest
20 | ```
21 | 
22 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/examples/rest-api/__init__.py


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/bruno/ec-rest-api/bruno.json:
--------------------------------------------------------------------------------
1 | {
2 |   "version": "1",
3 |   "name": "ec-rest-api",
4 |   "type": "collection"
5 | }


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/bruno/ec-rest-api/default_add.bru:
--------------------------------------------------------------------------------
 1 | meta {
 2 |   name: default_add
 3 |   type: http
 4 |   seq: 3
 5 | }
 6 | 
 7 | post {
 8 |   url: http://localhost:8080/add
 9 |   body: json
10 |   auth: none
11 | }
12 | 
13 | body:json {
14 |   {
15 |     "source": "source_url",
16 |     "data_type": "data_type"
17 |   }
18 | }
19 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/bruno/ec-rest-api/default_chat.bru:
--------------------------------------------------------------------------------
 1 | meta {
 2 |   name: default_chat
 3 |   type: http
 4 |   seq: 4
 5 | }
 6 | 
 7 | post {
 8 |   url: http://localhost:8080/chat
 9 |   body: json
10 |   auth: none
11 | }
12 | 
13 | body:json {
14 |   {
15 |     "message": "message"
16 |   }
17 | }
18 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/bruno/ec-rest-api/default_query.bru:
--------------------------------------------------------------------------------
 1 | meta {
 2 |   name: default_query
 3 |   type: http
 4 |   seq: 2
 5 | }
 6 | 
 7 | post {
 8 |   url: http://localhost:8080/query
 9 |   body: json
10 |   auth: none
11 | }
12 | 
13 | body:json {
14 |   {
15 |     "query": "Who is Elon Musk?"
16 |   }
17 | }
18 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/bruno/ec-rest-api/ping.bru:
--------------------------------------------------------------------------------
 1 | meta {
 2 |   name: ping
 3 |   type: http
 4 |   seq: 1
 5 | }
 6 | 
 7 | get {
 8 |   url: http://localhost:8080/ping
 9 |   body: json
10 |   auth: none
11 | }
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/configs/README.md:
--------------------------------------------------------------------------------
1 | ### Config directory
2 | 
3 | Here, all the YAML files will get stored.
4 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/database.py:
--------------------------------------------------------------------------------
 1 | from sqlalchemy import create_engine
 2 | from sqlalchemy.ext.declarative import declarative_base
 3 | from sqlalchemy.orm import sessionmaker
 4 | 
 5 | SQLALCHEMY_DATABASE_URI = "sqlite:///./app.db"
 6 | 
 7 | engine = create_engine(SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False})
 8 | 
 9 | SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
10 | 
11 | Base = declarative_base()
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/default.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: 'default'
 4 | 
 5 | llm:
 6 |   provider: gpt4all
 7 |   config:
 8 |     model: 'orca-mini-3b-gguf2-q4_0.gguf'
 9 |     temperature: 0.5
10 |     max_tokens: 1000
11 |     top_p: 1
12 |     stream: false
13 | 
14 | embedder:
15 |   provider: gpt4all
16 |   config:
17 |     model: 'all-MiniLM-L6-v2'
18 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/requirements.txt:
--------------------------------------------------------------------------------
 1 | fastapi==0.104.0
 2 | uvicorn==0.23.2
 3 | streamlit==1.29.0
 4 | embedchain==0.1.3
 5 | slack-sdk==3.21.3 
 6 | flask==2.3.3
 7 | fastapi-poe==0.0.16
 8 | discord==2.3.2
 9 | twilio==8.5.0
10 | huggingface-hub==0.17.3
11 | embedchain[community, opensource, elasticsearch, opensearch, weaviate, pinecone, qdrant, images, cohere, together, milvus, vertexai, llama2, gmail, json]==0.1.3
12 | sqlalchemy==2.0.22
13 | python-multipart==0.0.6
14 | youtube-transcript-api==0.6.1 
15 | pytube==15.0.0 
16 | beautifulsoup4==4.12.3
17 | slack-sdk==3.21.3
18 | huggingface_hub==0.23.0
19 | gitpython==3.1.38
20 | yt_dlp==2023.11.14
21 | PyGithub==1.59.1
22 | feedparser==6.0.10
23 | newspaper3k==0.2.8
24 | listparser==0.19


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/sample-config.yaml:
--------------------------------------------------------------------------------
 1 | app:
 2 |   config:
 3 |     id: 'default-app'
 4 | 
 5 | llm:
 6 |   provider: openai
 7 |   config:
 8 |     model: 'gpt-4o-mini'
 9 |     temperature: 0.5
10 |     max_tokens: 1000
11 |     top_p: 1
12 |     stream: false
13 |     template: |
14 |       Use the following pieces of context to answer the query at the end.
15 |       If you don't know the answer, just say that you don't know, don't try to make up an answer.
16 | 
17 |       $context
18 | 
19 |       Query: $query
20 | 
21 |       Helpful Answer:
22 | 
23 | vectordb:
24 |   provider: chroma
25 |   config:
26 |     collection_name: 'rest-api-app'
27 |     dir: db
28 |     allow_reset: true
29 | 
30 | embedder:
31 |   provider: openai
32 |   config:
33 |     model: 'text-embedding-ada-002'
34 | 


--------------------------------------------------------------------------------
/embedchain/examples/rest-api/services.py:
--------------------------------------------------------------------------------
 1 | from models import AppModel
 2 | from sqlalchemy.orm import Session
 3 | 
 4 | 
 5 | def get_app(db: Session, app_id: str):
 6 |     return db.query(AppModel).filter(AppModel.app_id == app_id).first()
 7 | 
 8 | 
 9 | def get_apps(db: Session, skip: int = 0, limit: int = 100):
10 |     return db.query(AppModel).offset(skip).limit(limit).all()
11 | 
12 | 
13 | def save_app(db: Session, app_id: str, config: str):
14 |     db_app = AppModel(app_id=app_id, config=config)
15 |     db.add(db_app)
16 |     db.commit()
17 |     db.refresh(db_app)
18 |     return db_app
19 | 
20 | 
21 | def remove_app(db: Session, app_id: str):
22 |     db_app = db.query(AppModel).filter(AppModel.app_id == app_id).first()
23 |     db.delete(db_app)
24 |     db.commit()
25 |     return db_app
26 | 


--------------------------------------------------------------------------------
/embedchain/examples/sadhguru-ai/README.md:
--------------------------------------------------------------------------------
 1 | ## Sadhguru AI
 2 | 
 3 | This directory contains the code used to implement [Sadhguru AI](https://sadhguru-ai.streamlit.app/) using Embedchain. It is built on 3K+ videos and 1K+ articles of Sadhguru. You can find the full list of data sources [here](https://gist.github.com/deshraj/50b0597157e04829bbbb7bc418be6ccb).
 4 | 
 5 | ## Run locally
 6 | 
 7 | You can run Sadhguru AI locally as a streamlit app using the following command:
 8 | 
 9 | ```bash
10 | export OPENAI_API_KEY=sk-xxx
11 | pip install -r requirements.txt
12 | streamlit run app.py
13 | ```
14 | 
15 | Note: Remember to set your `OPENAI_API_KEY`.
16 | 
17 | ## Deploy to production
18 | 
19 | You can create your own Sadhguru AI or similar RAG applications in production using one of the several deployment methods provided in [our docs](https://docs.embedchain.ai/get-started/deployment).
20 | 


--------------------------------------------------------------------------------
/embedchain/examples/sadhguru-ai/requirements.txt:
--------------------------------------------------------------------------------
1 | embedchain
2 | streamlit
3 | pysqlite3-binary


--------------------------------------------------------------------------------
/embedchain/examples/slack_bot/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /usr/src/
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | EXPOSE 8000
10 | 
11 | CMD ["python", "-m", "embedchain.bots.slack", "--port", "8000"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/slack_bot/requirements.txt:
--------------------------------------------------------------------------------
1 | slack-sdk==3.21.3 
2 | flask==2.3.3
3 | fastapi-poe==0.0.16


--------------------------------------------------------------------------------
/embedchain/examples/telegram_bot/.env.example:
--------------------------------------------------------------------------------
1 | TELEGRAM_BOT_TOKEN=
2 | OPENAI_API_KEY=
3 | 


--------------------------------------------------------------------------------
/embedchain/examples/telegram_bot/.gitignore:
--------------------------------------------------------------------------------
1 | __pycache__
2 | db
3 | database
4 | pyenv
5 | venv
6 | .env
7 | trash_files/
8 | 


--------------------------------------------------------------------------------
/embedchain/examples/telegram_bot/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /usr/src/
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | EXPOSE 8000
10 | 
11 | CMD ["python", "telegram_bot.py"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/telegram_bot/README.md:
--------------------------------------------------------------------------------
1 | # Telegram Bot
2 | 
3 | This is a replit template to create your own Telegram bot using the embedchain package. To know more about the bot and how to use it, go [here](https://docs.embedchain.ai/examples/telegram_bot).


--------------------------------------------------------------------------------
/embedchain/examples/telegram_bot/requirements.txt:
--------------------------------------------------------------------------------
1 | flask==2.3.2
2 | requests==2.31.0
3 | python-dotenv==1.0.0
4 | embedchain


--------------------------------------------------------------------------------
/embedchain/examples/unacademy-ai/requirements.txt:
--------------------------------------------------------------------------------
1 | embedchain
2 | streamlit
3 | pysqlite3-binary


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=
2 | 


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/.gitignore:
--------------------------------------------------------------------------------
1 | __pycache__
2 | db
3 | database
4 | pyenv
5 | venv
6 | .env
7 | trash_files/
8 | .ideas.md


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.11-slim
 2 | 
 3 | WORKDIR /usr/src/
 4 | COPY requirements.txt .
 5 | RUN pip install -r requirements.txt
 6 | 
 7 | COPY . .
 8 | 
 9 | EXPOSE 8000
10 | 
11 | CMD ["python", "whatsapp_bot.py"]
12 | 


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/README.md:
--------------------------------------------------------------------------------
1 | # WhatsApp Bot
2 | 
3 | This is a replit template to create your own WhatsApp bot using the embedchain package. To know more about the bot and how to use it, go [here](https://docs.embedchain.ai/examples/whatsapp_bot).


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/requirements.txt:
--------------------------------------------------------------------------------
1 | Flask==2.3.2
2 | twilio==8.5.0
3 | embedchain


--------------------------------------------------------------------------------
/embedchain/examples/whatsapp_bot/run.py:
--------------------------------------------------------------------------------
 1 | from embedchain.bots.whatsapp import WhatsAppBot
 2 | 
 3 | 
 4 | def main():
 5 |     whatsapp_bot = WhatsAppBot()
 6 |     whatsapp_bot.start()
 7 | 
 8 | 
 9 | if __name__ == "__main__":
10 |     main()
11 | 


--------------------------------------------------------------------------------
/embedchain/notebooks/azure_openai.yaml:
--------------------------------------------------------------------------------
 1 | 
 2 | llm:
 3 |   provider: azure_openai
 4 |   model: gpt-35-turbo
 5 |   config:
 6 |     deployment_name: ec_openai_azure
 7 |     temperature: 0.5
 8 |     max_tokens: 1000
 9 |     top_p: 1
10 |     stream: false
11 | 
12 | embedder:
13 |   provider: azure_openai
14 |   config:
15 |     model: text-embedding-ada-002
16 |     deployment_name: ec_embeddings_ada_002
17 | 


--------------------------------------------------------------------------------
/embedchain/notebooks/openai_azure.yaml:
--------------------------------------------------------------------------------
 1 | 
 2 | llm:
 3 |   provider: azure_openai
 4 |   model: gpt-35-turbo
 5 |   config:
 6 |     deployment_name: ec_openai_azure
 7 |     temperature: 0.5
 8 |     max_tokens: 1000
 9 |     top_p: 1
10 |     stream: false
11 | 
12 | embedder:
13 |   provider: azure_openai
14 |   config:
15 |     model: text-embedding-ada-002
16 |     deployment_name: ec_embeddings_ada_002
17 | 


--------------------------------------------------------------------------------
/embedchain/poetry.toml:
--------------------------------------------------------------------------------
1 | [virtualenvs]
2 | in-project = true
3 | path = "."


--------------------------------------------------------------------------------
/embedchain/tests/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/embedchain/tests/__init__.py


--------------------------------------------------------------------------------
/embedchain/tests/embedder/test_huggingface_embedder.py:
--------------------------------------------------------------------------------
 1 | 
 2 | from unittest.mock import patch
 3 | 
 4 | from embedchain.config import BaseEmbedderConfig
 5 | from embedchain.embedder.huggingface import HuggingFaceEmbedder
 6 | 
 7 | 
 8 | def test_huggingface_embedder_with_model(monkeypatch):
 9 |     config = BaseEmbedderConfig(model="test-model", model_kwargs={"param": "value"})
10 |     with patch('embedchain.embedder.huggingface.HuggingFaceEmbeddings') as mock_embeddings:
11 |         embedder = HuggingFaceEmbedder(config=config)
12 |         assert embedder.config.model == "test-model"
13 |         assert embedder.config.model_kwargs == {"param": "value"}
14 |         mock_embeddings.assert_called_once_with(
15 |             model_name="test-model",
16 |             model_kwargs={"param": "value"}
17 |         )
18 | 
19 | 
20 | 


--------------------------------------------------------------------------------
/embedchain/tests/llm/conftest.py:
--------------------------------------------------------------------------------
 1 | 
 2 | from unittest import mock
 3 | 
 4 | import pytest
 5 | 
 6 | 
 7 | @pytest.fixture(autouse=True)
 8 | def mock_alembic_command_upgrade():
 9 |     with mock.patch("alembic.command.upgrade"):
10 |         yield
11 | 


--------------------------------------------------------------------------------
/embedchain/tests/llm/test_clarifai.py:
--------------------------------------------------------------------------------
 1 | 
 2 | import pytest
 3 | 
 4 | from embedchain.config import BaseLlmConfig
 5 | from embedchain.llm.clarifai import ClarifaiLlm
 6 | 
 7 | 
 8 | @pytest.fixture
 9 | def clarifai_llm_config(monkeypatch):
10 |     monkeypatch.setenv("CLARIFAI_PAT","test_api_key")
11 |     config = BaseLlmConfig(
12 |         model="https://clarifai.com/openai/chat-completion/models/GPT-4",
13 |         model_kwargs={"temperature": 0.7, "max_tokens": 100},
14 |     )
15 |     yield config
16 |     monkeypatch.delenv("CLARIFAI_PAT")
17 | 
18 | def test_clarifai__llm_get_llm_model_answer(clarifai_llm_config, mocker):
19 |     mocker.patch("embedchain.llm.clarifai.ClarifaiLlm._get_answer", return_value="Test answer")
20 |     llm = ClarifaiLlm(clarifai_llm_config)
21 |     answer = llm.get_llm_model_answer("Test query")
22 | 
23 |     assert answer == "Test answer"
24 | 


--------------------------------------------------------------------------------
/embedchain/tests/loaders/test_local_text.py:
--------------------------------------------------------------------------------
 1 | import hashlib
 2 | 
 3 | import pytest
 4 | 
 5 | from embedchain.loaders.local_text import LocalTextLoader
 6 | 
 7 | 
 8 | @pytest.fixture
 9 | def text_loader():
10 |     return LocalTextLoader()
11 | 
12 | 
13 | def test_load_data(text_loader):
14 |     mock_content = "This is a sample text content."
15 | 
16 |     result = text_loader.load_data(mock_content)
17 | 
18 |     assert "doc_id" in result
19 |     assert "data" in result
20 | 
21 |     url = "local"
22 |     assert result["data"][0]["content"] == mock_content
23 | 
24 |     assert result["data"][0]["meta_data"]["url"] == url
25 | 
26 |     expected_doc_id = hashlib.sha256((mock_content + url).encode()).hexdigest()
27 |     assert result["doc_id"] == expected_doc_id
28 | 


--------------------------------------------------------------------------------
/evaluation/src/utils.py:
--------------------------------------------------------------------------------
1 | TECHNIQUES = ["mem0", "rag", "langmem", "zep", "openai"]
2 | 
3 | METHODS = ["add", "search"]
4 | 


--------------------------------------------------------------------------------
/examples/graph-db-demo/alice-memories.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/graph-db-demo/alice-memories.png


--------------------------------------------------------------------------------
/examples/mem0-demo/.env.example:
--------------------------------------------------------------------------------
1 | MEM0_API_KEY=your_mem0_api_key
2 | OPENAI_API_KEY=your_openai_api_key


--------------------------------------------------------------------------------
/examples/mem0-demo/.gitignore:
--------------------------------------------------------------------------------
1 | !lib/
2 | .next/
3 | node_modules/
4 | .env


--------------------------------------------------------------------------------
/examples/mem0-demo/app/favicon.ico:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/mem0-demo/app/favicon.ico


--------------------------------------------------------------------------------
/examples/mem0-demo/app/page.tsx:
--------------------------------------------------------------------------------
1 | import { Assistant } from "@/app/assistant"
2 | 
3 | export default function Page() {
4 |   return <Assistant />
5 | }


--------------------------------------------------------------------------------
/examples/mem0-demo/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "new-york",
 4 |   "rsc": true,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.ts",
 8 |     "css": "app/globals.css",
 9 |     "baseColor": "zinc",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/lib/utils",
16 |     "ui": "@/components/ui",
17 |     "lib": "@/lib",
18 |     "hooks": "@/hooks"
19 |   },
20 |   "iconLibrary": "lucide"
21 | }


--------------------------------------------------------------------------------
/examples/mem0-demo/eslint.config.mjs:
--------------------------------------------------------------------------------
 1 | import { dirname } from "path";
 2 | import { fileURLToPath } from "url";
 3 | import { FlatCompat } from "@eslint/eslintrc";
 4 | 
 5 | const __filename = fileURLToPath(import.meta.url);
 6 | const __dirname = dirname(__filename);
 7 | 
 8 | const compat = new FlatCompat({
 9 |   baseDirectory: __dirname,
10 | });
11 | 
12 | const eslintConfig = [
13 |   ...compat.extends("next/core-web-vitals", "next/typescript"),
14 | ];
15 | 
16 | export default eslintConfig;
17 | 


--------------------------------------------------------------------------------
/examples/mem0-demo/images/assistant-ui-dark.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square">
2 | 	<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z">
3 | 	</path>
4 | 	<path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1">
5 | 	</path>
6 | </svg>


--------------------------------------------------------------------------------
/examples/mem0-demo/images/assistant-ui.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square">
2 | 	<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z">
3 | 	</path>
4 | 	<path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1">
5 | 	</path>
6 | </svg>


--------------------------------------------------------------------------------
/examples/mem0-demo/lib/utils.ts:
--------------------------------------------------------------------------------
1 | import { clsx, type ClassValue } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
7 | 


--------------------------------------------------------------------------------
/examples/mem0-demo/next-env.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="next" />
2 | /// <reference types="next/image-types/global" />
3 | 
4 | // NOTE: This file should not be edited
5 | // see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
6 | 


--------------------------------------------------------------------------------
/examples/mem0-demo/next.config.ts:
--------------------------------------------------------------------------------
1 | import type { NextConfig } from "next";
2 | 
3 | const nextConfig: NextConfig = {
4 |   /* config options here */
5 | };
6 | 
7 | export default nextConfig;
8 | 


--------------------------------------------------------------------------------
/examples/mem0-demo/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | /** @type {import('postcss-load-config').Config} */
2 | const config = {
3 |   plugins: {
4 |     tailwindcss: {},
5 |   },
6 | };
7 | 
8 | export default config;
9 | 


--------------------------------------------------------------------------------
/examples/mem0-demo/public/file.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>


--------------------------------------------------------------------------------
/examples/mem0-demo/public/vercel.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>


--------------------------------------------------------------------------------
/examples/mem0-demo/public/window.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>


--------------------------------------------------------------------------------
/examples/mem0-demo/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2017",
 4 |     "lib": ["dom", "dom.iterable", "esnext"],
 5 |     "allowJs": true,
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "preserve",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "paths": {
22 |       "@/*": ["./*"]
23 |     }
24 |   },
25 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
26 |   "exclude": ["node_modules"]
27 | }
28 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/.gitattributes:
--------------------------------------------------------------------------------
1 | # Auto detect text files and perform LF normalization
2 | * text=auto
3 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/.gitignore:
--------------------------------------------------------------------------------
 1 | **/.env
 2 | **/node_modules
 3 | **/dist
 4 | **/.DS_Store
 5 | 
 6 | # Logs
 7 | logs
 8 | *.log
 9 | npm-debug.log*
10 | yarn-debug.log*
11 | yarn-error.log*
12 | pnpm-debug.log*
13 | lerna-debug.log*
14 | 
15 | node_modules
16 | dist
17 | dist-ssr
18 | *.local
19 | 
20 | # Editor directories and files
21 | .vscode/*
22 | !.vscode/extensions.json
23 | .idea
24 | .DS_Store
25 | *.suo
26 | *.ntvs*
27 | *.njsproj
28 | *.sln
29 | *.sw?
30 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "new-york",
 4 |   "rsc": false,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.js",
 8 |     "css": "src/index.css",
 9 |     "baseColor": "zinc",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/libs/utils",
16 |     "ui": "@/components/ui",
17 |     "lib": "@/libs",
18 |     "hooks": "@/hooks"
19 |   }
20 | }


--------------------------------------------------------------------------------
/examples/multimodal-demo/eslint.config.js:
--------------------------------------------------------------------------------
 1 | import js from '@eslint/js'
 2 | import globals from 'globals'
 3 | import reactHooks from 'eslint-plugin-react-hooks'
 4 | import reactRefresh from 'eslint-plugin-react-refresh'
 5 | import tseslint from 'typescript-eslint'
 6 | 
 7 | export default tseslint.config(
 8 |   { ignores: ['dist'] },
 9 |   {
10 |     extends: [js.configs.recommended, ...tseslint.configs.recommended],
11 |     files: ['**/*.{ts,tsx}'],
12 |     languageOptions: {
13 |       ecmaVersion: 2020,
14 |       globals: globals.browser,
15 |     },
16 |     plugins: {
17 |       'react-hooks': reactHooks,
18 |       'react-refresh': reactRefresh,
19 |     },
20 |     rules: {
21 |       ...reactHooks.configs.recommended.rules,
22 |       'react-refresh/only-export-components': [
23 |         'warn',
24 |         { allowConstantExport: true },
25 |       ],
26 |     },
27 |   },
28 | )
29 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <link rel="icon" type="image/svg+xml" href="/mem0_logo.jpeg" />
 6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7 |     <title>JustChat | Chat with AI</title>
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="/src/main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/postcss.config.js:
--------------------------------------------------------------------------------
1 | export default {
2 |   plugins: {
3 |     tailwindcss: {},
4 |     autoprefixer: {},
5 |   },
6 | }
7 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/public/mem0_logo.jpeg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/multimodal-demo/public/mem0_logo.jpeg


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/App.tsx:
--------------------------------------------------------------------------------
 1 | import Home from "./page"
 2 | 
 3 | 
 4 | function App() {
 5 | 
 6 |   return (
 7 |     <>
 8 |       <Home />
 9 |     </>
10 |   )
11 | }
12 | 
13 | export default App
14 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/assets/mem0_logo.jpeg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/multimodal-demo/src/assets/mem0_logo.jpeg


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/assets/user.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/multimodal-demo/src/assets/user.jpg


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as LabelPrimitive from "@radix-ui/react-label"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/libs/utils"
 6 | 
 7 | const labelVariants = cva(
 8 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
 9 | )
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
14 |     VariantProps<typeof labelVariants>
15 | >(({ className, ...props }, ref) => (
16 |   <LabelPrimitive.Root
17 |     ref={ref}
18 |     className={cn(labelVariants(), className)}
19 |     {...props}
20 |   />
21 | ))
22 | Label.displayName = LabelPrimitive.Root.displayName
23 | 
24 | export { Label }
25 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/libs/utils.ts:
--------------------------------------------------------------------------------
1 | import { clsx, type ClassValue } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
7 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/main.tsx:
--------------------------------------------------------------------------------
 1 | import { StrictMode } from 'react'
 2 | import { createRoot } from 'react-dom/client'
 3 | import './index.css'
 4 | import App from './App.tsx'
 5 | 
 6 | createRoot(document.getElementById('root')!).render(
 7 |   <StrictMode>
 8 |     <App />
 9 |   </StrictMode>,
10 | )
11 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | import { GlobalState } from "./contexts/GlobalContext";
 3 | import Component from "./pages/home";
 4 | 
 5 | 
 6 | export default function Home() {
 7 |   return (
 8 |     <div>
 9 |       <GlobalState>
10 |         <Component />
11 |       </GlobalState>
12 |     </div>
13 |   );
14 | }
15 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/types.ts:
--------------------------------------------------------------------------------
 1 | /* eslint-disable @typescript-eslint/no-explicit-any */
 2 | export interface Memory {
 3 |   id: string;
 4 |   content: string;
 5 |   timestamp: string;
 6 |   tags: string[];
 7 | }
 8 | 
 9 | export interface Message {
10 |   id: string;
11 |   content: string;
12 |   sender: "user" | "assistant";
13 |   timestamp: string;
14 |   image?: string;
15 |   audio?: any;
16 | }
17 | 
18 | export interface FileInfo {
19 |   name: string;
20 |   type: string;
21 |   size: number;
22 | }


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/utils/fileUtils.ts:
--------------------------------------------------------------------------------
 1 | import { Buffer } from 'buffer';
 2 | 
 3 | export const convertToBase64 = (file: File): Promise<string> => {
 4 |   return new Promise((resolve, reject) => {
 5 |     const reader = new FileReader();
 6 |     reader.readAsDataURL(file);
 7 |     reader.onload = () => resolve(reader.result as string);
 8 |     reader.onerror = error => reject(error);
 9 |   });
10 | };
11 | 
12 | export const getFileBuffer = async (file: File): Promise<Buffer> => {
13 |   const response = await fetch(URL.createObjectURL(file));
14 |   const arrayBuffer = await response.arrayBuffer();
15 |   return Buffer.from(arrayBuffer);
16 | }; 


--------------------------------------------------------------------------------
/examples/multimodal-demo/src/vite-env.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="vite/client" />
2 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "files": [],
 3 |   "references": [
 4 |     { "path": "./tsconfig.app.json" },
 5 |     { "path": "./tsconfig.node.json" }
 6 |   ],
 7 |   "compilerOptions": {
 8 |     "baseUrl": ".",
 9 |     "paths": {
10 |       "@/*": ["./src/*"]
11 |     }
12 |   }
13 | }
14 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/tsconfig.node.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
 4 |     "target": "ES2022",
 5 |     "lib": ["ES2023"],
 6 |     "module": "ESNext",
 7 |     "skipLibCheck": true,
 8 | 
 9 |     /* Bundler mode */
10 |     "moduleResolution": "Bundler",
11 |     "allowImportingTsExtensions": true,
12 |     "isolatedModules": true,
13 |     "moduleDetection": "force",
14 |     "noEmit": true,
15 | 
16 |     /* Linting */
17 |     "strict": true,
18 |     "noUnusedLocals": true,
19 |     "noUnusedParameters": true,
20 |     "noFallthroughCasesInSwitch": true,
21 |     "noUncheckedSideEffectImports": true
22 |   },
23 |   "include": ["vite.config.ts"]
24 | }
25 | 


--------------------------------------------------------------------------------
/examples/multimodal-demo/vite.config.ts:
--------------------------------------------------------------------------------
 1 | import path from "path"
 2 | import react from "@vitejs/plugin-react"
 3 | import { defineConfig } from "vite"
 4 | 
 5 | export default defineConfig({
 6 |   plugins: [react()],
 7 |   resolve: {
 8 |     alias: {
 9 |       "@": path.resolve(__dirname, "./src"),
10 |       buffer: 'buffer'
11 |     },
12 |   },
13 | })
14 | 


--------------------------------------------------------------------------------
/examples/openai-inbuilt-tools/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "openai-inbuilt-tools",
 3 |   "version": "1.0.0",
 4 |   "description": "",
 5 |   "license": "ISC",
 6 |   "author": "",
 7 |   "type": "module",
 8 |   "main": "index.js",
 9 |   "scripts": {
10 |     "test": "echo \"Error: no test specified\" && exit 1",
11 |     "start": "node index.js"
12 |   },
13 |   "packageManager": "pnpm@10.5.2+sha512.da9dc28cd3ff40d0592188235ab25d3202add8a207afbedc682220e4a0029ffbff4562102b9e6e46b4e3f9e8bd53e6d05de48544b0c57d4b0179e22c76d1199b",
14 |   "dependencies": {
15 |     "mem0ai": "^2.1.2",
16 |     "openai": "^4.87.2",
17 |     "zod": "^3.24.2"
18 |   }
19 | }
20 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/.gitattributes:
--------------------------------------------------------------------------------
1 | # Auto detect text files and perform LF normalization
2 | * text=auto
3 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/.gitignore:
--------------------------------------------------------------------------------
 1 | **/.env
 2 | **/node_modules
 3 | **/dist
 4 | **/.DS_Store
 5 | 
 6 | # Logs
 7 | logs
 8 | *.log
 9 | npm-debug.log*
10 | yarn-debug.log*
11 | yarn-error.log*
12 | pnpm-debug.log*
13 | lerna-debug.log*
14 | 
15 | node_modules
16 | dist
17 | dist-ssr
18 | *.local
19 | 
20 | # Editor directories and files
21 | .vscode/*
22 | !.vscode/extensions.json
23 | .idea
24 | .DS_Store
25 | *.suo
26 | *.ntvs*
27 | *.njsproj
28 | *.sln
29 | *.sw?
30 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "new-york",
 4 |   "rsc": false,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.js",
 8 |     "css": "src/index.css",
 9 |     "baseColor": "zinc",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/libs/utils",
16 |     "ui": "@/components/ui",
17 |     "lib": "@/libs",
18 |     "hooks": "@/hooks"
19 |   }
20 | }


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/eslint.config.js:
--------------------------------------------------------------------------------
 1 | import js from '@eslint/js'
 2 | import globals from 'globals'
 3 | import reactHooks from 'eslint-plugin-react-hooks'
 4 | import reactRefresh from 'eslint-plugin-react-refresh'
 5 | import tseslint from 'typescript-eslint'
 6 | 
 7 | export default tseslint.config(
 8 |   { ignores: ['dist'] },
 9 |   {
10 |     extends: [js.configs.recommended, ...tseslint.configs.recommended],
11 |     files: ['**/*.{ts,tsx}'],
12 |     languageOptions: {
13 |       ecmaVersion: 2020,
14 |       globals: globals.browser,
15 |     },
16 |     plugins: {
17 |       'react-hooks': reactHooks,
18 |       'react-refresh': reactRefresh,
19 |     },
20 |     rules: {
21 |       ...reactHooks.configs.recommended.rules,
22 |       'react-refresh/only-export-components': [
23 |         'warn',
24 |         { allowConstantExport: true },
25 |       ],
26 |     },
27 |   },
28 | )
29 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <link rel="icon" type="image/svg+xml" href="/mem0_logo.jpeg" />
 6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7 |     <title>JustChat | Chat with AI</title>
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="/src/main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/postcss.config.js:
--------------------------------------------------------------------------------
1 | export default {
2 |   plugins: {
3 |     tailwindcss: {},
4 |     autoprefixer: {},
5 |   },
6 | }
7 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/public/mem0_logo.jpeg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/vercel-ai-sdk-chat-app/public/mem0_logo.jpeg


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/App.tsx:
--------------------------------------------------------------------------------
 1 | import Home from "./page"
 2 | 
 3 | 
 4 | function App() {
 5 | 
 6 |   return (
 7 |     <>
 8 |       <Home />
 9 |     </>
10 |   )
11 | }
12 | 
13 | export default App
14 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/assets/mem0_logo.jpeg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/vercel-ai-sdk-chat-app/src/assets/mem0_logo.jpeg


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/assets/user.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/examples/vercel-ai-sdk-chat-app/src/assets/user.jpg


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as LabelPrimitive from "@radix-ui/react-label"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/libs/utils"
 6 | 
 7 | const labelVariants = cva(
 8 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
 9 | )
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
14 |     VariantProps<typeof labelVariants>
15 | >(({ className, ...props }, ref) => (
16 |   <LabelPrimitive.Root
17 |     ref={ref}
18 |     className={cn(labelVariants(), className)}
19 |     {...props}
20 |   />
21 | ))
22 | Label.displayName = LabelPrimitive.Root.displayName
23 | 
24 | export { Label }
25 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/libs/utils.ts:
--------------------------------------------------------------------------------
1 | import { clsx, type ClassValue } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
7 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/main.tsx:
--------------------------------------------------------------------------------
 1 | import { StrictMode } from 'react'
 2 | import { createRoot } from 'react-dom/client'
 3 | import './index.css'
 4 | import App from './App.tsx'
 5 | 
 6 | createRoot(document.getElementById('root')!).render(
 7 |   <StrictMode>
 8 |     <App />
 9 |   </StrictMode>,
10 | )
11 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | import { GlobalState } from "./contexts/GlobalContext";
 3 | import Component from "./pages/home";
 4 | 
 5 | 
 6 | export default function Home() {
 7 |   return (
 8 |     <div>
 9 |       <GlobalState>
10 |         <Component />
11 |       </GlobalState>
12 |     </div>
13 |   );
14 | }
15 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/types.ts:
--------------------------------------------------------------------------------
 1 | /* eslint-disable @typescript-eslint/no-explicit-any */
 2 | export interface Memory {
 3 |   id: string;
 4 |   content: string;
 5 |   timestamp: string;
 6 |   tags: string[];
 7 | }
 8 | 
 9 | export interface Message {
10 |   id: string;
11 |   content: string;
12 |   sender: "user" | "assistant";
13 |   timestamp: string;
14 |   image?: string;
15 |   audio?: any;
16 | }
17 | 
18 | export interface FileInfo {
19 |   name: string;
20 |   type: string;
21 |   size: number;
22 | }


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/utils/fileUtils.ts:
--------------------------------------------------------------------------------
 1 | import { Buffer } from 'buffer';
 2 | 
 3 | export const convertToBase64 = (file: File): Promise<string> => {
 4 |   return new Promise((resolve, reject) => {
 5 |     const reader = new FileReader();
 6 |     reader.readAsDataURL(file);
 7 |     reader.onload = () => resolve(reader.result as string);
 8 |     reader.onerror = error => reject(error);
 9 |   });
10 | };
11 | 
12 | export const getFileBuffer = async (file: File): Promise<Buffer> => {
13 |   const response = await fetch(URL.createObjectURL(file));
14 |   const arrayBuffer = await response.arrayBuffer();
15 |   return Buffer.from(arrayBuffer);
16 | }; 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/src/vite-env.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="vite/client" />
2 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "files": [],
 3 |   "references": [
 4 |     { "path": "./tsconfig.app.json" },
 5 |     { "path": "./tsconfig.node.json" }
 6 |   ],
 7 |   "compilerOptions": {
 8 |     "baseUrl": ".",
 9 |     "paths": {
10 |       "@/*": ["./src/*"]
11 |     }
12 |   }
13 | }
14 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/tsconfig.node.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
 4 |     "target": "ES2022",
 5 |     "lib": ["ES2023"],
 6 |     "module": "ESNext",
 7 |     "skipLibCheck": true,
 8 | 
 9 |     /* Bundler mode */
10 |     "moduleResolution": "Bundler",
11 |     "allowImportingTsExtensions": true,
12 |     "isolatedModules": true,
13 |     "moduleDetection": "force",
14 |     "noEmit": true,
15 | 
16 |     /* Linting */
17 |     "strict": true,
18 |     "noUnusedLocals": true,
19 |     "noUnusedParameters": true,
20 |     "noFallthroughCasesInSwitch": true,
21 |     "noUncheckedSideEffectImports": true
22 |   },
23 |   "include": ["vite.config.ts"]
24 | }
25 | 


--------------------------------------------------------------------------------
/examples/vercel-ai-sdk-chat-app/vite.config.ts:
--------------------------------------------------------------------------------
 1 | import path from "path"
 2 | import react from "@vitejs/plugin-react"
 3 | import { defineConfig } from "vite"
 4 | 
 5 | export default defineConfig({
 6 |   plugins: [react()],
 7 |   resolve: {
 8 |     alias: {
 9 |       "@": path.resolve(__dirname, "./src"),
10 |       buffer: 'buffer'
11 |     },
12 |   },
13 | })
14 | 


--------------------------------------------------------------------------------
/examples/yt-assistant-chrome/.gitignore:
--------------------------------------------------------------------------------
1 | node_modules
2 | .env*
3 | dist
4 | package-lock.json


--------------------------------------------------------------------------------
/mem0-ts/jest.config.js:
--------------------------------------------------------------------------------
 1 | /** @type {import('ts-jest').JestConfigWithTsJest} */
 2 | module.exports = {
 3 |   preset: "ts-jest",
 4 |   testEnvironment: "node",
 5 |   roots: ["<rootDir>/src", "<rootDir>/tests"],
 6 |   testMatch: [
 7 |     "**/__tests__/**/*.+(ts|tsx|js)",
 8 |     "**/?(*.)+(spec|test).+(ts|tsx|js)",
 9 |   ],
10 |   transform: {
11 |     "^.+\\.(ts|tsx)
quot;: [
12 |       "ts-jest",
13 |       {
14 |         tsconfig: "tsconfig.test.json",
15 |       },
16 |     ],
17 |   },
18 |   moduleNameMapper: {
19 |     "^@/(.*)
quot;: "<rootDir>/src/$1",
20 |   },
21 |   setupFiles: ["dotenv/config"],
22 |   testPathIgnorePatterns: ["/node_modules/", "/dist/"],
23 |   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
24 |   globals: {
25 |     "ts-jest": {
26 |       tsconfig: "tsconfig.test.json",
27 |     },
28 |   },
29 | };
30 | 


--------------------------------------------------------------------------------
/mem0-ts/src/client/index.ts:
--------------------------------------------------------------------------------
 1 | import { MemoryClient } from "./mem0";
 2 | import type * as MemoryTypes from "./mem0.types";
 3 | 
 4 | // Re-export all types from mem0.types
 5 | export type {
 6 |   MemoryOptions,
 7 |   ProjectOptions,
 8 |   Memory,
 9 |   MemoryHistory,
10 |   MemoryUpdateBody,
11 |   ProjectResponse,
12 |   PromptUpdatePayload,
13 |   SearchOptions,
14 |   Webhook,
15 |   WebhookPayload,
16 |   Messages,
17 |   Message,
18 |   AllUsers,
19 |   User,
20 |   FeedbackPayload,
21 |   Feedback,
22 | } from "./mem0.types";
23 | 
24 | // Export the main client
25 | export { MemoryClient };
26 | export default MemoryClient;
27 | 


--------------------------------------------------------------------------------
/mem0-ts/src/client/telemetry.types.ts:
--------------------------------------------------------------------------------
 1 | export interface TelemetryClient {
 2 |   captureEvent(
 3 |     distinctId: string,
 4 |     eventName: string,
 5 |     properties?: Record<string, any>,
 6 |   ): Promise<void>;
 7 |   shutdown(): Promise<void>;
 8 | }
 9 | 
10 | export interface TelemetryInstance {
11 |   telemetryId: string;
12 |   constructor: {
13 |     name: string;
14 |   };
15 |   host?: string;
16 |   apiKey?: string;
17 | }
18 | 
19 | export interface TelemetryEventData {
20 |   function: string;
21 |   method: string;
22 |   api_host?: string;
23 |   timestamp?: string;
24 |   client_source: "browser" | "nodejs";
25 |   client_version: string;
26 |   [key: string]: any;
27 | }
28 | 
29 | export interface TelemetryOptions {
30 |   enabled?: boolean;
31 |   apiKey?: string;
32 |   host?: string;
33 |   version?: string;
34 | }
35 | 


--------------------------------------------------------------------------------
/mem0-ts/src/community/.prettierignore:
--------------------------------------------------------------------------------
 1 | # Dependencies
 2 | node_modules
 3 | .pnp
 4 | .pnp.js
 5 | 
 6 | # Build outputs
 7 | dist
 8 | build
 9 | 
10 | # Lock files
11 | package-lock.json
12 | yarn.lock
13 | pnpm-lock.yaml
14 | 
15 | # Coverage
16 | coverage
17 | 
18 | # Misc
19 | .DS_Store
20 | .env.local
21 | .env.development.local
22 | .env.test.local
23 | .env.production.local
24 | 
25 | # Logs
26 | npm-debug.log*
27 | yarn-debug.log*
28 | yarn-error.log* 


--------------------------------------------------------------------------------
/mem0-ts/src/community/src/index.ts:
--------------------------------------------------------------------------------
1 | export * from "./integrations/langchain";
2 | 


--------------------------------------------------------------------------------
/mem0-ts/src/community/src/integrations/langchain/index.ts:
--------------------------------------------------------------------------------
1 | export * from "./mem0";
2 | 


--------------------------------------------------------------------------------
/mem0-ts/src/community/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2020",
 4 |     "module": "ESNext",
 5 |     "lib": ["ES2020"],
 6 |     "declaration": true,
 7 |     "declarationMap": true,
 8 |     "sourceMap": true,
 9 |     "outDir": "./dist",
10 |     "rootDir": "./src",
11 |     "strict": true,
12 |     "moduleResolution": "node",
13 |     "esModuleInterop": true,
14 |     "skipLibCheck": true,
15 |     "forceConsistentCasingInFileNames": true,
16 |     "types": ["node"],
17 |     "typeRoots": ["./node_modules/@types"]
18 |   },
19 |   "include": ["src/**/*.ts"],
20 |   "exclude": ["node_modules", "dist", "**/*.test.ts"]
21 | }
22 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/.gitignore:
--------------------------------------------------------------------------------
 1 | # Dependencies
 2 | node_modules/
 3 | 
 4 | # Build output
 5 | dist/
 6 | 
 7 | # Environment variables
 8 | .env
 9 | 
10 | # IDE files
11 | .vscode/
12 | .idea/
13 | 
14 | # Logs
15 | *.log
16 | npm-debug.log*
17 | 
18 | # SQLite database
19 | *.db
20 | 
21 | # OS files
22 | .DS_Store
23 | Thumbs.db 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/embeddings/base.ts:
--------------------------------------------------------------------------------
1 | export interface Embedder {
2 |   embed(text: string): Promise<number[]>;
3 |   embedBatch(texts: string[]): Promise<number[][]>;
4 | }
5 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/llms/base.ts:
--------------------------------------------------------------------------------
 1 | import { Message } from "../types";
 2 | 
 3 | export interface LLMResponse {
 4 |   content: string;
 5 |   role: string;
 6 |   toolCalls?: Array<{
 7 |     name: string;
 8 |     arguments: string;
 9 |   }>;
10 | }
11 | 
12 | export interface LLM {
13 |   generateResponse(
14 |     messages: Array<{ role: string; content: string }>,
15 |     response_format?: { type: string },
16 |     tools?: any[],
17 |   ): Promise<any>;
18 |   generateChat(messages: Message[]): Promise<LLMResponse>;
19 | }
20 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/memory/memory.types.ts:
--------------------------------------------------------------------------------
 1 | import { Message } from "../types";
 2 | import { SearchFilters } from "../types";
 3 | 
 4 | export interface Entity {
 5 |   userId?: string;
 6 |   agentId?: string;
 7 |   runId?: string;
 8 | }
 9 | 
10 | export interface AddMemoryOptions extends Entity {
11 |   metadata?: Record<string, any>;
12 |   filters?: SearchFilters;
13 |   infer?: boolean;
14 | }
15 | 
16 | export interface SearchMemoryOptions extends Entity {
17 |   limit?: number;
18 |   filters?: SearchFilters;
19 | }
20 | 
21 | export interface GetAllMemoryOptions extends Entity {
22 |   limit?: number;
23 | }
24 | 
25 | export interface DeleteAllMemoryOptions extends Entity {}
26 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/storage/DummyHistoryManager.ts:
--------------------------------------------------------------------------------
 1 | export class DummyHistoryManager {
 2 |   constructor() {}
 3 | 
 4 |   async addHistory(
 5 |     memoryId: string,
 6 |     previousValue: string | null,
 7 |     newValue: string | null,
 8 |     action: string,
 9 |     createdAt?: string,
10 |     updatedAt?: string,
11 |     isDeleted: number = 0,
12 |   ): Promise<void> {
13 |     return;
14 |   }
15 | 
16 |   async getHistory(memoryId: string): Promise<any[]> {
17 |     return [];
18 |   }
19 | 
20 |   async reset(): Promise<void> {
21 |     return;
22 |   }
23 | 
24 |   close(): void {
25 |     return;
26 |   }
27 | }
28 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/storage/base.ts:
--------------------------------------------------------------------------------
 1 | export interface HistoryManager {
 2 |   addHistory(
 3 |     memoryId: string,
 4 |     previousValue: string | null,
 5 |     newValue: string | null,
 6 |     action: string,
 7 |     createdAt?: string,
 8 |     updatedAt?: string,
 9 |     isDeleted?: number,
10 |   ): Promise<void>;
11 |   getHistory(memoryId: string): Promise<any[]>;
12 |   reset(): Promise<void>;
13 |   close(): void;
14 | }
15 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/storage/index.ts:
--------------------------------------------------------------------------------
1 | export * from "./SQLiteManager";
2 | export * from "./DummyHistoryManager";
3 | export * from "./SupabaseHistoryManager";
4 | export * from "./MemoryHistoryManager";
5 | export * from "./base";
6 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/utils/logger.ts:
--------------------------------------------------------------------------------
 1 | export interface Logger {
 2 |   info: (message: string) => void;
 3 |   error: (message: string) => void;
 4 |   debug: (message: string) => void;
 5 |   warn: (message: string) => void;
 6 | }
 7 | 
 8 | export const logger: Logger = {
 9 |   info: (message: string) => console.log(`[INFO] ${message}`),
10 |   error: (message: string) => console.error(`[ERROR] ${message}`),
11 |   debug: (message: string) => console.debug(`[DEBUG] ${message}`),
12 |   warn: (message: string) => console.warn(`[WARN] ${message}`),
13 | };
14 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/src/utils/telemetry.types.ts:
--------------------------------------------------------------------------------
 1 | export interface TelemetryClient {
 2 |   captureEvent(
 3 |     distinctId: string,
 4 |     eventName: string,
 5 |     properties?: Record<string, any>,
 6 |   ): Promise<void>;
 7 |   shutdown(): Promise<void>;
 8 | }
 9 | 
10 | export interface TelemetryInstance {
11 |   telemetryId: string;
12 |   constructor: {
13 |     name: string;
14 |   };
15 |   host?: string;
16 |   apiKey?: string;
17 | }
18 | 
19 | export interface TelemetryEventData {
20 |   function: string;
21 |   method: string;
22 |   api_host?: string;
23 |   timestamp?: string;
24 |   client_source: "browser" | "nodejs";
25 |   client_version: string;
26 |   [key: string]: any;
27 | }
28 | 
29 | export interface TelemetryOptions {
30 |   enabled?: boolean;
31 |   apiKey?: string;
32 |   host?: string;
33 |   version?: string;
34 | }
35 | 


--------------------------------------------------------------------------------
/mem0-ts/src/oss/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2020",
 4 |     "module": "commonjs",
 5 |     "lib": ["ES2020"],
 6 |     "declaration": true,
 7 |     "outDir": "./dist",
 8 |     "rootDir": "./src",
 9 |     "strict": true,
10 |     "esModuleInterop": true,
11 |     "skipLibCheck": true,
12 |     "forceConsistentCasingInFileNames": true
13 |   },
14 |   "include": ["src/**/*"],
15 |   "exclude": ["node_modules", "dist", "**/*.test.ts"]
16 | }
17 | 


--------------------------------------------------------------------------------
/mem0-ts/tests/.gitkeep:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0-ts/tests/.gitkeep


--------------------------------------------------------------------------------
/mem0-ts/tsconfig.test.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "extends": "./tsconfig.json",
 3 |   "compilerOptions": {
 4 |     "types": ["node", "jest"],
 5 |     "rootDir": ".",
 6 |     "noEmit": true
 7 |   },
 8 |   "include": ["src/**/*", "**/*.test.ts", "**/*.spec.ts"],
 9 |   "exclude": ["node_modules", "dist"]
10 | }
11 | 


--------------------------------------------------------------------------------
/mem0-ts/tsup.config.ts:
--------------------------------------------------------------------------------
 1 | import { defineConfig } from "tsup";
 2 | 
 3 | const external = [
 4 |   "openai",
 5 |   "@anthropic-ai/sdk",
 6 |   "groq-sdk",
 7 |   "uuid",
 8 |   "pg",
 9 |   "zod",
10 |   "sqlite3",
11 |   "@qdrant/js-client-rest",
12 |   "redis",
13 | ];
14 | 
15 | export default defineConfig([
16 |   {
17 |     entry: ["src/client/index.ts"],
18 |     format: ["cjs", "esm"],
19 |     dts: true,
20 |     sourcemap: true,
21 |     external,
22 |   },
23 |   {
24 |     entry: ["src/oss/src/index.ts"],
25 |     outDir: "dist/oss",
26 |     format: ["cjs", "esm"],
27 |     dts: true,
28 |     sourcemap: true,
29 |     external,
30 |   },
31 | ]);
32 | 


--------------------------------------------------------------------------------
/mem0/__init__.py:
--------------------------------------------------------------------------------
1 | import importlib.metadata
2 | 
3 | __version__ = importlib.metadata.version("mem0ai")
4 | 
5 | from mem0.client.main import AsyncMemoryClient, MemoryClient  # noqa
6 | from mem0.memory.main import AsyncMemory, Memory  # noqa
7 | 


--------------------------------------------------------------------------------
/mem0/client/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/client/__init__.py


--------------------------------------------------------------------------------
/mem0/configs/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/configs/__init__.py


--------------------------------------------------------------------------------
/mem0/configs/embeddings/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/configs/embeddings/__init__.py


--------------------------------------------------------------------------------
/mem0/configs/enums.py:
--------------------------------------------------------------------------------
1 | from enum import Enum
2 | 
3 | 
4 | class MemoryType(Enum):
5 |     SEMANTIC = "semantic_memory"
6 |     EPISODIC = "episodic_memory"
7 |     PROCEDURAL = "procedural_memory"
8 | 


--------------------------------------------------------------------------------
/mem0/configs/llms/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/configs/llms/__init__.py


--------------------------------------------------------------------------------
/mem0/configs/vector_stores/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/configs/vector_stores/__init__.py


--------------------------------------------------------------------------------
/mem0/embeddings/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/embeddings/__init__.py


--------------------------------------------------------------------------------
/mem0/embeddings/mock.py:
--------------------------------------------------------------------------------
 1 | from typing import Literal, Optional
 2 | 
 3 | from mem0.embeddings.base import EmbeddingBase
 4 | 
 5 | 
 6 | class MockEmbeddings(EmbeddingBase):
 7 |     def embed(self, text, memory_action: Optional[Literal["add", "search", "update"]] = None):
 8 |         """
 9 |         Generate a mock embedding with dimension of 10.
10 |         """
11 |         return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
12 | 


--------------------------------------------------------------------------------
/mem0/llms/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/llms/__init__.py


--------------------------------------------------------------------------------
/mem0/llms/utils/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/llms/utils/__init__.py


--------------------------------------------------------------------------------
/mem0/llms/utils/functions.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/llms/utils/functions.py


--------------------------------------------------------------------------------
/mem0/memory/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/memory/__init__.py


--------------------------------------------------------------------------------
/mem0/proxy/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/proxy/__init__.py


--------------------------------------------------------------------------------
/mem0/vector_stores/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/mem0/vector_stores/__init__.py


--------------------------------------------------------------------------------
/openmemory/.gitignore:
--------------------------------------------------------------------------------
 1 | *.db
 2 | .env*
 3 | !.env.example
 4 | !.env.dev
 5 | !ui/lib
 6 | .venv/
 7 | __pycache__
 8 | .DS_Store
 9 | node_modules/
10 | *.log
11 | api/.openmemory*
12 | **/.next
13 | .openmemory/


--------------------------------------------------------------------------------
/openmemory/api/.dockerignore:
--------------------------------------------------------------------------------
 1 | # Ignore all .env files
 2 | **/.env
 3 | **/.env.*
 4 | 
 5 | # Ignore all database files
 6 | **/*.db
 7 | **/*.sqlite
 8 | **/*.sqlite3
 9 | 
10 | # Ignore logs
11 | **/*.log
12 | 
13 | # Ignore runtime data
14 | **/node_modules
15 | **/__pycache__
16 | **/.pytest_cache
17 | **/.coverage
18 | **/coverage
19 | 
20 | # Ignore Docker runtime files
21 | **/.dockerignore
22 | **/Dockerfile
23 | **/docker-compose*.yml 


--------------------------------------------------------------------------------
/openmemory/api/.env.example:
--------------------------------------------------------------------------------
1 | OPENAI_API_KEY=sk-xxx
2 | USER=user


--------------------------------------------------------------------------------
/openmemory/api/.python-version:
--------------------------------------------------------------------------------
1 | 3.12


--------------------------------------------------------------------------------
/openmemory/api/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.12-slim
 2 | 
 3 | LABEL org.opencontainers.image.name="mem0/openmemory-mcp"
 4 | 
 5 | WORKDIR /usr/src/openmemory
 6 | 
 7 | COPY requirements.txt .
 8 | RUN pip install -r requirements.txt
 9 | 
10 | COPY config.json .
11 | COPY . .
12 | 
13 | EXPOSE 8765
14 | CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8765"]
15 | 


--------------------------------------------------------------------------------
/openmemory/api/alembic/README:
--------------------------------------------------------------------------------
1 | Generic single-database configuration.


--------------------------------------------------------------------------------
/openmemory/api/alembic/script.py.mako:
--------------------------------------------------------------------------------
 1 | """${message}
 2 | 
 3 | Revision ID: ${up_revision}
 4 | Revises: ${down_revision | comma,n}
 5 | Create Date: ${create_date}
 6 | 
 7 | """
 8 | from typing import Sequence, Union
 9 | 
10 | from alembic import op
11 | import sqlalchemy as sa
12 | ${imports if imports else ""}
13 | 
14 | # revision identifiers, used by Alembic.
15 | revision: str = ${repr(up_revision)}
16 | down_revision: Union[str, None] = ${repr(down_revision)}
17 | branch_labels: Union[str, Sequence[str], None] = ${repr(branch_labels)}
18 | depends_on: Union[str, Sequence[str], None] = ${repr(depends_on)}
19 | 
20 | 
21 | def upgrade() -> None:
22 |     """Upgrade schema."""
23 |     ${upgrades if upgrades else "pass"}
24 | 
25 | 
26 | def downgrade() -> None:
27 |     """Downgrade schema."""
28 |     ${downgrades if downgrades else "pass"}
29 | 


--------------------------------------------------------------------------------
/openmemory/api/app/__init__.py:
--------------------------------------------------------------------------------
1 | # This file makes the app directory a Python package


--------------------------------------------------------------------------------
/openmemory/api/app/config.py:
--------------------------------------------------------------------------------
1 | import os
2 | 
3 | USER_ID = os.getenv("USER", "default_user")
4 | DEFAULT_APP_ID = "openmemory"


--------------------------------------------------------------------------------
/openmemory/api/app/routers/__init__.py:
--------------------------------------------------------------------------------
1 | from .memories import router as memories_router
2 | from .apps import router as apps_router
3 | from .stats import router as stats_router
4 | from .config import router as config_router
5 | 
6 | __all__ = ["memories_router", "apps_router", "stats_router", "config_router"]


--------------------------------------------------------------------------------
/openmemory/api/app/utils/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/api/app/utils/__init__.py


--------------------------------------------------------------------------------
/openmemory/api/config.json:
--------------------------------------------------------------------------------
 1 | {
 2 |     "mem0": {
 3 |         "llm": {
 4 |             "provider": "openai",
 5 |             "config": {
 6 |                 "model": "gpt-4o-mini",
 7 |                 "temperature": 0.1,
 8 |                 "max_tokens": 2000,
 9 |                 "api_key": "env:API_KEY"
10 |             }
11 |         },
12 |         "embedder": {
13 |             "provider": "openai",
14 |             "config": {
15 |                 "model": "text-embedding-3-small",
16 |                 "api_key": "env:API_KEY"
17 |             }
18 |         }
19 |     }
20 | }


--------------------------------------------------------------------------------
/openmemory/api/default_config.json:
--------------------------------------------------------------------------------
 1 | {
 2 |     "mem0": {
 3 |         "llm": {
 4 |             "provider": "openai",
 5 |             "config": {
 6 |                 "model": "gpt-4o-mini",
 7 |                 "temperature": 0.1,
 8 |                 "max_tokens": 2000,
 9 |                 "api_key": "env:OPENAI_API_KEY"
10 |             }
11 |         },
12 |         "embedder": {
13 |             "provider": "openai",
14 |             "config": {
15 |                 "model": "text-embedding-3-small",
16 |                 "api_key": "env:OPENAI_API_KEY"
17 |             }
18 |         }
19 |     }
20 | } 


--------------------------------------------------------------------------------
/openmemory/api/requirements.txt:
--------------------------------------------------------------------------------
 1 | fastapi>=0.68.0
 2 | uvicorn>=0.15.0
 3 | sqlalchemy>=1.4.0
 4 | python-dotenv>=0.19.0
 5 | alembic>=1.7.0
 6 | psycopg2-binary>=2.9.0
 7 | python-multipart>=0.0.5
 8 | fastapi-pagination>=0.12.0
 9 | mem0ai>=0.1.92
10 | mcp[cli]>=1.3.0
11 | pytest>=7.0.0
12 | pytest-asyncio>=0.21.0
13 | httpx>=0.24.0
14 | pytest-cov>=4.0.0
15 | tenacity==9.1.2
16 | anthropic==0.51.0
17 | ollama==0.4.8


--------------------------------------------------------------------------------
/openmemory/ui/.dockerignore:
--------------------------------------------------------------------------------
 1 | # Ignore all .env files
 2 | **/.env
 3 | 
 4 | 
 5 | # Ignore all database files
 6 | **/*.db
 7 | **/*.sqlite
 8 | **/*.sqlite3
 9 | 
10 | # Ignore logs
11 | **/*.log
12 | 
13 | # Ignore runtime data
14 | **/node_modules
15 | **/__pycache__
16 | **/.pytest_cache
17 | **/.coverage
18 | **/coverage
19 | 
20 | # Ignore Docker runtime files
21 | **/.dockerignore
22 | **/Dockerfile
23 | **/docker-compose*.yml 


--------------------------------------------------------------------------------
/openmemory/ui/.env.example:
--------------------------------------------------------------------------------
1 | NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
2 | NEXT_PUBLIC_USER_ID=NEXT_PUBLIC_USER_ID
3 | 


--------------------------------------------------------------------------------
/openmemory/ui/app/apps/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { AppFilters } from "./components/AppFilters";
 4 | import { AppGrid } from "./components/AppGrid";
 5 | import "@/styles/animation.css";
 6 | 
 7 | export default function AppsPage() {
 8 |   return (
 9 |     <main className="flex-1 py-6">
10 |       <div className="container">
11 |         <div className="mt-1 pb-4 animate-fade-slide-down">
12 |           <AppFilters />
13 |         </div>
14 |         <div className="animate-fade-slide-down delay-1">
15 |           <AppGrid />
16 |         </div>
17 |       </div>
18 |     </main>
19 |   );
20 | }
21 | 


--------------------------------------------------------------------------------
/openmemory/ui/app/loading.tsx:
--------------------------------------------------------------------------------
1 | export default function Loading() {
2 |   return null;
3 | }
4 | 


--------------------------------------------------------------------------------
/openmemory/ui/app/providers.tsx:
--------------------------------------------------------------------------------
1 | "use client";
2 | 
3 | import { Provider } from "react-redux";
4 | import { store } from "../store/store";
5 | 
6 | export function Providers({ children }: { children: React.ReactNode }) {
7 |   return <Provider store={store}>{children}</Provider>;
8 | }
9 | 


--------------------------------------------------------------------------------
/openmemory/ui/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "default",
 4 |   "rsc": true,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.ts",
 8 |     "css": "app/globals.css",
 9 |     "baseColor": "neutral",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/lib/utils",
16 |     "ui": "@/components/ui",
17 |     "lib": "@/lib",
18 |     "hooks": "@/hooks"
19 |   },
20 |   "iconLibrary": "lucide"
21 | }


--------------------------------------------------------------------------------
/openmemory/ui/components/theme-provider.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import * as React from "react";
 4 | import {
 5 |   ThemeProvider as NextThemesProvider,
 6 |   type ThemeProviderProps,
 7 | } from "next-themes";
 8 | 
 9 | export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
10 |   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
11 | }
12 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/types.ts:
--------------------------------------------------------------------------------
 1 | export type Category = "personal" | "work" | "health" | "finance" | "travel" | "education" | "preferences" | "relationships"
 2 | export type Client = "chrome" | "chatgpt" | "cursor" | "windsurf" | "terminal" | "api"
 3 | 
 4 | export interface Memory {
 5 |   id: string
 6 |   memory: string
 7 |   metadata: any
 8 |   client: Client
 9 |   categories: Category[]
10 |   created_at: number
11 |   app_name: string
12 |   state: "active" | "paused" | "archived" | "deleted"
13 | }


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/aspect-ratio.tsx:
--------------------------------------------------------------------------------
1 | "use client"
2 | 
3 | import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
4 | 
5 | const AspectRatio = AspectRatioPrimitive.Root
6 | 
7 | export { AspectRatio }
8 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/collapsible.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
 4 | 
 5 | const Collapsible = CollapsiblePrimitive.Root
 6 | 
 7 | const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
 8 | 
 9 | const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent
10 | 
11 | export { Collapsible, CollapsibleTrigger, CollapsibleContent }
12 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as LabelPrimitive from "@radix-ui/react-label"
 5 | import { cva, type VariantProps } from "class-variance-authority"
 6 | 
 7 | import { cn } from "@/lib/utils"
 8 | 
 9 | const labelVariants = cva(
10 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
11 | )
12 | 
13 | const Label = React.forwardRef<
14 |   React.ElementRef<typeof LabelPrimitive.Root>,
15 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
16 |     VariantProps<typeof labelVariants>
17 | >(({ className, ...props }, ref) => (
18 |   <LabelPrimitive.Root
19 |     ref={ref}
20 |     className={cn(labelVariants(), className)}
21 |     {...props}
22 |   />
23 | ))
24 | Label.displayName = LabelPrimitive.Root.displayName
25 | 
26 | export { Label }
27 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/skeleton.tsx:
--------------------------------------------------------------------------------
 1 | import { cn } from "@/lib/utils"
 2 | 
 3 | function Skeleton({
 4 |   className,
 5 |   ...props
 6 | }: React.HTMLAttributes<HTMLDivElement>) {
 7 |   return (
 8 |     <div
 9 |       className={cn("animate-pulse rounded-md bg-muted", className)}
10 |       {...props}
11 |     />
12 |   )
13 | }
14 | 
15 | export { Skeleton }
16 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/textarea.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Textarea = React.forwardRef<
 6 |   HTMLTextAreaElement,
 7 |   React.ComponentProps<"textarea">
 8 | >(({ className, ...props }, ref) => {
 9 |   return (
10 |     <textarea
11 |       className={cn(
12 |         "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
13 |         className
14 |       )}
15 |       ref={ref}
16 |       {...props}
17 |     />
18 |   )
19 | })
20 | Textarea.displayName = "Textarea"
21 | 
22 | export { Textarea }
23 | 


--------------------------------------------------------------------------------
/openmemory/ui/components/ui/use-mobile.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | const MOBILE_BREAKPOINT = 768
 4 | 
 5 | export function useIsMobile() {
 6 |   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
 7 | 
 8 |   React.useEffect(() => {
 9 |     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
10 |     const onChange = () => {
11 |       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
12 |     }
13 |     mql.addEventListener("change", onChange)
14 |     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
15 |     return () => mql.removeEventListener("change", onChange)
16 |   }, [])
17 | 
18 |   return !!isMobile
19 | }
20 | 


--------------------------------------------------------------------------------
/openmemory/ui/entrypoint.sh:
--------------------------------------------------------------------------------
 1 | #!/bin/sh
 2 | set -e
 3 | 
 4 | # Ensure the working directory is correct
 5 | cd /app
 6 | 
 7 | 
 8 | 
 9 | # Replace env variable placeholders with real values
10 | printenv | grep NEXT_PUBLIC_ | while read -r line ; do
11 |   key=$(echo $line | cut -d "=" -f1)
12 |   value=$(echo $line | cut -d "=" -f2)
13 | 
14 |   find .next/ -type f -exec sed -i "s|$key|$value|g" {} \;
15 | done
16 | echo "Done replacing env variables NEXT_PUBLIC_ with real values"
17 | 
18 | 
19 | # Execute the container's main process (CMD in Dockerfile)
20 | exec "$@"


--------------------------------------------------------------------------------
/openmemory/ui/hooks/use-mobile.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | const MOBILE_BREAKPOINT = 768
 4 | 
 5 | export function useIsMobile() {
 6 |   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
 7 | 
 8 |   React.useEffect(() => {
 9 |     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
10 |     const onChange = () => {
11 |       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
12 |     }
13 |     mql.addEventListener("change", onChange)
14 |     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
15 |     return () => mql.removeEventListener("change", onChange)
16 |   }, [])
17 | 
18 |   return !!isMobile
19 | }
20 | 


--------------------------------------------------------------------------------
/openmemory/ui/hooks/useUI.ts:
--------------------------------------------------------------------------------
 1 | import { useDispatch, useSelector } from 'react-redux';
 2 | import { AppDispatch, RootState } from '@/store/store';
 3 | import { openUpdateMemoryDialog, closeUpdateMemoryDialog } from '@/store/uiSlice';
 4 | 
 5 | export const useUI = () => {
 6 |   const dispatch = useDispatch<AppDispatch>();
 7 |   const updateMemoryDialog = useSelector((state: RootState) => state.ui.dialogs.updateMemory);
 8 | 
 9 |   const handleOpenUpdateMemoryDialog = (memoryId: string, memoryContent: string) => {
10 |     dispatch(openUpdateMemoryDialog({ memoryId, memoryContent }));
11 |   };
12 | 
13 |   const handleCloseUpdateMemoryDialog = () => {
14 |     dispatch(closeUpdateMemoryDialog());
15 |   };
16 | 
17 |   return {
18 |     updateMemoryDialog,
19 |     handleOpenUpdateMemoryDialog,
20 |     handleCloseUpdateMemoryDialog,
21 |   };
22 | }; 


--------------------------------------------------------------------------------
/openmemory/ui/lib/utils.ts:
--------------------------------------------------------------------------------
1 | import { type ClassValue, clsx } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
7 | 


--------------------------------------------------------------------------------
/openmemory/ui/next-env.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="next" />
2 | /// <reference types="next/image-types/global" />
3 | 
4 | // NOTE: This file should not be edited
5 | // see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
6 | 


--------------------------------------------------------------------------------
/openmemory/ui/next.config.dev.mjs:
--------------------------------------------------------------------------------
 1 | /** @type {import('next').NextConfig} */
 2 | const nextConfig = {
 3 |   output: "standalone",
 4 |   eslint: {
 5 |     ignoreDuringBuilds: true,
 6 |   },
 7 |   typescript: {
 8 |     ignoreBuildErrors: true,
 9 |   },
10 |   images: {
11 |     unoptimized: true,
12 |   },
13 | }
14 | 
15 | export default nextConfig


--------------------------------------------------------------------------------
/openmemory/ui/next.config.mjs:
--------------------------------------------------------------------------------
 1 | /** @type {import('next').NextConfig} */
 2 | const nextConfig = {
 3 |   eslint: {
 4 |     ignoreDuringBuilds: true,
 5 |   },
 6 |   typescript: {
 7 |     ignoreBuildErrors: true,
 8 |   },
 9 |   images: {
10 |     unoptimized: true,
11 |   },
12 | }
13 | 
14 | export default nextConfig


--------------------------------------------------------------------------------
/openmemory/ui/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | /** @type {import('postcss-load-config').Config} */
2 | const config = {
3 |   plugins: {
4 |     tailwindcss: {},
5 |   },
6 | };
7 | 
8 | export default config;
9 | 


--------------------------------------------------------------------------------
/openmemory/ui/public/images/claude.webp:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/claude.webp


--------------------------------------------------------------------------------
/openmemory/ui/public/images/cline.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/cline.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/cursor.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/cursor.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/default.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/default.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/enconvo.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/enconvo.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/roocline.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/roocline.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/windsurf.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/windsurf.png


--------------------------------------------------------------------------------
/openmemory/ui/public/images/witsy.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/openmemory/ui/public/images/witsy.png


--------------------------------------------------------------------------------
/openmemory/ui/public/placeholder-logo.png:
--------------------------------------------------------------------------------
1 | �PNG
2 | 
3 | ���
IHDR����������M�����0PLTE������������������������������������������������Z?���tRNS�� �@��`P0p���w���IDATx��ؽJ3Q�7'��%�|?� ���E�l�7���(X�D������w`����[�*t����D���mD�}��4;;�DDDDDDDDDDDD_�_İ��!�y�`�_�:��;Ļ�'|�	��;.I"����3*5����J�1�� �T��FI��	��=��3܃�2~�b���0��U9\��]�4�#w0��Gt\&1�?21,���o!e�m��ĻR�����5�� ؽAJ�9��R)�5�0.FFASaǃ�T�#|�K���I�������1�
4 | M������N"��$����G�V�T���T^^��A�$S��h(�������G]co"J׸^^�'�=���%�	�W�6Ы�W��w�a�߇*�^^�YG�c���`'F����������������^�5_�,�S�%����IEND�B`�


--------------------------------------------------------------------------------
/openmemory/ui/skeleton/AppFiltersSkeleton.tsx:
--------------------------------------------------------------------------------
 1 | export function AppFiltersSkeleton() {
 2 |   return (
 3 |     <div className="flex items-center gap-2">
 4 |       <div className="relative flex-1">
 5 |         <div className="h-9 w-[500px] bg-zinc-800 rounded animate-pulse" />
 6 |       </div>
 7 |       <div className="h-9 w-[130px] bg-zinc-800 rounded animate-pulse" />
 8 |       <div className="h-9 w-[150px] bg-zinc-800 rounded animate-pulse" />
 9 |     </div>
10 |   );
11 | } 


--------------------------------------------------------------------------------
/openmemory/ui/styles/animation.css:
--------------------------------------------------------------------------------
 1 | @keyframes fadeSlideDown {
 2 |   from {
 3 |     opacity: 0;
 4 |     transform: translateY(-20px);
 5 |   }
 6 |   to {
 7 |     opacity: 1;
 8 |     transform: translateY(0);
 9 |   }
10 | }
11 | 
12 | .animate-fade-slide-down {
13 |   opacity: 0;
14 |   animation: fadeSlideDown 0.5s ease-out forwards;
15 | }
16 | 
17 | .delay-1 {
18 |   animation-delay: 0.07s;
19 | }
20 | 
21 | .delay-2 {
22 |   animation-delay: 0.14s;
23 | }
24 | 
25 | .delay-3 {
26 |   animation-delay: 0.21s;
27 | }
28 | 


--------------------------------------------------------------------------------
/openmemory/ui/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "lib": ["dom", "dom.iterable", "esnext"],
 4 |     "allowJs": true,
 5 |     "target": "ES6",
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "preserve",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "paths": {
22 |       "@/*": ["./*"]
23 |     }
24 |   },
25 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
26 |   "exclude": ["node_modules"]
27 | }
28 | 


--------------------------------------------------------------------------------
/server/.env.example:
--------------------------------------------------------------------------------
 1 | OPENAI_API_KEY=
 2 | NEO4J_URI=
 3 | NEO4J_USERNAME=
 4 | NEO4J_PASSWORD=
 5 | 
 6 | 
 7 | POSTGRES_HOST=
 8 | POSTGRES_PORT=
 9 | POSTGRES_DB=
10 | POSTGRES_USER=
11 | POSTGRES_PASSWORD=
12 | POSTGRES_COLLECTION_NAME=
13 | 


--------------------------------------------------------------------------------
/server/Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.12-slim
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | COPY requirements.txt .
 6 | 
 7 | RUN pip install --no-cache-dir -r requirements.txt
 8 | 
 9 | COPY . .
10 | 
11 | EXPOSE 8000
12 | 
13 | ENV PYTHONUNBUFFERED=1
14 | 
15 | CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
16 | 


--------------------------------------------------------------------------------
/server/Makefile:
--------------------------------------------------------------------------------
1 | build:
2 | 	docker build -t mem0-api-server .
3 | 
4 | run_local:
5 | 	docker run -p 8000:8000 -v $(shell pwd):/app mem0-api-server --env-file .env
6 | 
7 | .PHONY: build run_local
8 | 


--------------------------------------------------------------------------------
/server/dev.Dockerfile:
--------------------------------------------------------------------------------
 1 | FROM python:3.12
 2 | 
 3 | WORKDIR /app
 4 | 
 5 | # Install Poetry
 6 | RUN curl -sSL https://install.python-poetry.org | python3 -
 7 | ENV PATH="/root/.local/bin:$PATH"
 8 | 
 9 | # Copy requirements first for better caching
10 | COPY server/requirements.txt .
11 | RUN pip install -r requirements.txt
12 | 
13 | # Install mem0 in editable mode using Poetry
14 | WORKDIR /app/packages
15 | COPY pyproject.toml .
16 | COPY poetry.lock .
17 | COPY README.md .
18 | COPY mem0 ./mem0
19 | RUN pip install -e .[graph]
20 | 
21 | # Return to app directory and copy server code
22 | WORKDIR /app
23 | COPY server .
24 | 
25 | CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
26 | 


--------------------------------------------------------------------------------
/server/requirements.txt:
--------------------------------------------------------------------------------
1 | fastapi==0.115.8
2 | uvicorn==0.34.0
3 | pydantic==2.10.4
4 | mem0ai>=0.1.48
5 | python-dotenv==1.0.1
6 | 


--------------------------------------------------------------------------------
/tests/__init__.py:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/mem0ai/mem0/c7e91171a03da1b7dfcfc02c1f3f346485f2c259/tests/__init__.py


--------------------------------------------------------------------------------
/tests/configs/test_prompts.py:
--------------------------------------------------------------------------------
 1 | from mem0.configs import prompts
 2 | 
 3 | 
 4 | def test_get_update_memory_messages():
 5 |     retrieved_old_memory_dict = [{"id": "1", "text": "old memory 1"}]
 6 |     response_content = ["new fact"]
 7 |     custom_update_memory_prompt = "custom prompt determining memory update"
 8 | 
 9 |     ## When custom update memory prompt is provided
10 |     ##
11 |     result = prompts.get_update_memory_messages(
12 |         retrieved_old_memory_dict, response_content, custom_update_memory_prompt
13 |     )
14 |     assert result.startswith(custom_update_memory_prompt)
15 | 
16 |     ## When custom update memory prompt is not provided
17 |     ##
18 |     result = prompts.get_update_memory_messages(retrieved_old_memory_dict, response_content, None)
19 |     assert result.startswith(prompts.DEFAULT_UPDATE_MEMORY_PROMPT)
20 | 


--------------------------------------------------------------------------------
/vercel-ai-sdk/.gitattributes:
--------------------------------------------------------------------------------
1 | # Auto detect text files and perform LF normalization
2 | * text=auto
3 | 


--------------------------------------------------------------------------------
/vercel-ai-sdk/.gitignore:
--------------------------------------------------------------------------------
 1 | **/.env
 2 | **/node_modules
 3 | **/.DS_Store
 4 | 
 5 | # Ignore test-related files
 6 | **/coverage.data
 7 | **/coverage/
 8 | 
 9 | # Build files
10 | **/dist


--------------------------------------------------------------------------------
/vercel-ai-sdk/jest.config.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |     preset: 'ts-jest',
3 |     testEnvironment: 'node',
4 |     globalTeardown: './teardown.ts',
5 | };
6 |   


--------------------------------------------------------------------------------
/vercel-ai-sdk/nodemon.json:
--------------------------------------------------------------------------------
1 | {
2 |     "watch": ["src"],
3 |     "ext": ".ts,.js",
4 |     "exec": "ts-node ./example/index.ts"
5 | }


--------------------------------------------------------------------------------
/vercel-ai-sdk/src/index.ts:
--------------------------------------------------------------------------------
1 | export * from './mem0-facade'
2 | export type { Mem0Provider, Mem0ProviderSettings } from './mem0-provider'
3 | export { createMem0, mem0 } from './mem0-provider'
4 | export type { Mem0ConfigSettings, Mem0ChatConfig, Mem0ChatSettings } from './mem0-types'
5 | export { addMemories, retrieveMemories, searchMemories, getMemories } from './mem0-utils'


--------------------------------------------------------------------------------
/vercel-ai-sdk/teardown.ts:
--------------------------------------------------------------------------------
 1 | import { testConfig } from './config/test-config';
 2 | 
 3 | export default async function () {
 4 |   console.log("Running global teardown...");
 5 |   try {
 6 |     await testConfig.fetchDeleteId();
 7 |     await testConfig.deleteUser();
 8 |     console.log("User deleted successfully after all tests.");
 9 |   } catch (error) {
10 |     console.error("Failed to delete user after all tests:", error);
11 |   }
12 | }


--------------------------------------------------------------------------------
/vercel-ai-sdk/tsup.config.ts:
--------------------------------------------------------------------------------
 1 | import { defineConfig } from 'tsup'
 2 | 
 3 | export default defineConfig([
 4 |   {
 5 |     dts: true,
 6 |     entry: ['src/index.ts'],
 7 |     format: ['cjs', 'esm'],
 8 |     sourcemap: true,
 9 |   },
10 | ])


--------------------------------------------------------------------------------