class District {
  final String name;
  final double lat;
  final double lon;

  const District({required this.name, required this.lat, required this.lon});

  factory District.fromJson(Map<String, dynamic> json) {
    return District(
      name: json['name'] as String,
      lat: (json['lat'] as num).toDouble(),
      lon: (json['lon'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {'name': name, 'lat': lat, 'lon': lon};

  @override
  String toString() => name;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is District && name == other.name;

  @override
  int get hashCode => name.hashCode;
}
