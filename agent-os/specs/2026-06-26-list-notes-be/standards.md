# Standards for List Notes BE

## services-selectors architecture
- Read operations go in selectors.py
- Write operations go in services.py
- Views are thin: call selector/service, serialize, return response

## serializers-views
- Use separate Input/Output serializers
- APIView with explicit permission_classes

## testing
- Use factory_boy factories, not fixtures
- Use Faker for random data
- Mirror categories/tests/ structure
