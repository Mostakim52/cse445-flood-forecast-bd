import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../theme/app_theme.dart';
import '../services/chat_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ChatService _chatService = ChatService();
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isStreaming = false;
  bool _llmConnected = false;
  String _streamBuffer = '';

  @override
  void initState() {
    super.initState();
    _checkLlm();
    _messages.add(ChatMessage(
      role: 'assistant',
      content: '**Hello! I\'m FloodBot** 🌊 — your flood forecasting assistant for Bangladesh.\n\n'
          'I can help you with:\n\n'
          '• Flood risk information for any district\n'
          '• Weather conditions and monsoon patterns\n'
          '• Safety recommendations during flood alerts\n'
          '• Understanding forecast results\n\n'
          'How can I help you today?',
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _checkLlm() async {
    final connected = await _chatService.healthCheck();
    if (mounted) setState(() => _llmConnected = connected);
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isStreaming) return;

    setState(() {
      _messages.add(ChatMessage(role: 'user', content: text));
      _isStreaming = true;
      _streamBuffer = '';
    });
    _controller.clear();
    _scrollToBottom();

    // Add placeholder for streaming response
    setState(() {
      _messages.add(ChatMessage(role: 'assistant', content: ''));
    });

    // Stream response
    await for (final token in _chatService.streamChat(_messages.sublist(0, _messages.length - 1))) {
      if (mounted) {
        setState(() {
          _streamBuffer += token;
          _messages.last = ChatMessage(role: 'assistant', content: _streamBuffer);
        });
        _scrollToBottom();
      }
    }

    if (mounted) {
      setState(() => _isStreaming = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = AppTheme.background(context);
    final surfColor = AppTheme.surface(context);
    final textPrimary = AppTheme.textPrimary(context);
    final textMuted = AppTheme.textMuted(context);
    final cardColor = AppTheme.card(context);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: surfColor,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.smart_toy_rounded, size: 18, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Flood Forecast AI',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textPrimary),
                ),
                Text(
                  'Powered by Groq',
                  style: TextStyle(fontSize: 11, color: textMuted, fontWeight: FontWeight.w400),
                ),
              ],
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: (_llmConnected ? AppTheme.lowRisk : AppTheme.highRisk).withAlpha(20),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: (_llmConnected ? AppTheme.lowRisk : AppTheme.highRisk).withAlpha(60),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: BoxDecoration(
                    color: _llmConnected ? AppTheme.lowRisk : AppTheme.highRisk,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  _llmConnected ? 'Online' : 'Offline',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: _llmConnected ? AppTheme.lowRisk : AppTheme.highRisk,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: _messages.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: _messages.length,
                    itemBuilder: (ctx, i) => _buildMessage(_messages[i]),
                  ),
          ),

          // Input area
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    final textPrimary = AppTheme.textPrimary(context);
    final textMuted = AppTheme.textMuted(context);

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withAlpha(15),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.chat_rounded,
              size: 48,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Start a conversation',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Ask about flood forecasting in Bangladesh',
            style: TextStyle(color: textMuted),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(ChatMessage msg) {
    final isUser = msg.role == 'user';
    final textPrimary = AppTheme.textPrimary(context);
    final textMuted = AppTheme.textMuted(context);
    final surfColor = AppTheme.surface(context);
    final cardColor = AppTheme.card(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isUser) _buildAvatar(),
          if (!isUser) const SizedBox(width: 10),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isUser
                    ? AppTheme.primaryColor.withAlpha(30)
                    : surfColor,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
                border: Border.all(
                  color: isUser
                      ? AppTheme.primaryColor.withAlpha(30)
                      : AppTheme.borderAccentColor(context),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Markdown(
                    data: msg.content.isEmpty ? '...' : msg.content,
                    shrinkWrap: true,
                    padding: EdgeInsets.zero,
                    selectable: true,
                    styleSheet: MarkdownStyleSheet(
                      p: TextStyle(
                        fontSize: 14,
                        color: textPrimary,
                        height: 1.5,
                      ),
                      strong: TextStyle(
                        fontSize: 14,
                        color: textPrimary,
                        fontWeight: FontWeight.bold,
                        height: 1.5,
                      ),
                      em: TextStyle(
                        fontSize: 14,
                        color: textPrimary,
                        fontStyle: FontStyle.italic,
                        height: 1.5,
                      ),
                      listBullet: TextStyle(
                        fontSize: 14,
                        color: textPrimary,
                        height: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '${msg.timestamp.hour.toString().padLeft(2, '0')}:${msg.timestamp.minute.toString().padLeft(2, '0')}',
                        style: TextStyle(
                          fontSize: 10,
                          color: textMuted,
                        ),
                      ),
                      if (!isUser && msg.content.isNotEmpty) ...[
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () {
                            Clipboard.setData(ClipboardData(text: msg.content));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text('Copied to clipboard'),
                                backgroundColor: cardColor,
                                duration: const Duration(seconds: 1),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                            );
                          },
                          child: Icon(
                            Icons.copy_rounded,
                            size: 12,
                            color: textMuted,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (isUser) const SizedBox(width: 10),
          if (isUser) _buildUserAvatar(),
        ],
      ),
    );
  }

  Widget _buildAvatar() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
        ),
        borderRadius: BorderRadius.circular(10),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.asset(
          isDark ? 'assets/images/icon_dark.png' : 'assets/images/icon_light.png',
          width: 32,
          height: 32,
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  Widget _buildUserAvatar() {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: AppTheme.accentColor.withAlpha(30),
        borderRadius: BorderRadius.circular(10),
      ),
      child: const Icon(Icons.person_rounded, size: 16, color: AppTheme.accentColor),
    );
  }

  Widget _buildInputArea() {
    final surfColor = AppTheme.surface(context);
    final cardColor = AppTheme.card(context);
    final textMuted = AppTheme.textMuted(context);

    return Container(
      padding: EdgeInsets.fromLTRB(
        16,
        8,
        16,
        MediaQuery.of(context).padding.bottom + 8,
      ),
      decoration: BoxDecoration(
        color: surfColor,
        border: Border(top: BorderSide(color: AppTheme.borderAccentColor(context))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: TextField(
                controller: _controller,
                enabled: !_isStreaming,
                style: TextStyle(
                  color: AppTheme.textPrimary(context),
                  fontSize: 14,
                ),
                maxLines: null,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
                decoration: InputDecoration(
                  hintText: _llmConnected
                      ? 'Ask about flood forecasting...'
                      : 'LLM offline (start Ollama)',
                  hintStyle: TextStyle(color: textMuted),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _isStreaming ? null : _sendMessage,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: _isStreaming
                    ? null
                    : const LinearGradient(
                        colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                      ),
                color: _isStreaming ? textMuted : null,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: _isStreaming
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
