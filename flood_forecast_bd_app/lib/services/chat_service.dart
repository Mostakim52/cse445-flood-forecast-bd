import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ChatMessage {
  final String role;
  final String content;
  final DateTime timestamp;

  ChatMessage({
    required this.role,
    required this.content,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

class ChatService {
  static String get _baseUrl {
    if (Platform.isAndroid) return 'http://10.0.2.2:5000';
    if (Platform.isIOS || Platform.isMacOS) return 'http://localhost:5000';
    return 'http://127.0.0.1:5000';
  }

  Future<bool> healthCheck() async {
    try {
      final res = await http.get(Uri.parse('$_baseUrl/health'));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Stream<String> streamChat(List<ChatMessage> history) async* {
    final messages = history
        .map((m) => {'role': m.role, 'content': m.content})
        .toList();

    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/chat'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'messages': messages}),
      );

      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        final response = data['response'] as String? ?? 'No response';
        yield response;
      } else {
        yield 'Error: Server returned ${res.statusCode}';
      }
    } catch (e) {
      yield 'Error connecting to server: $e';
    }
  }
}
