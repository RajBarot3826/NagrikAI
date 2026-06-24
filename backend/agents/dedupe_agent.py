import math

# Section 6: DedupeAgent Logic

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine formula to calculate distance in meters
    R = 6371000 # radius of earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def run_dedupe_check(new_issue, existing_issues):
    """
    Check new report against existing issues within 150m radius.
    Merge if similarity > 70%
    """
    duplicates = []
    possibly_related = []

    for issue in existing_issues:
        if issue.status == 'RESOLVED':
            continue

        dist = calculate_distance(new_issue['latitude'], new_issue['longitude'], issue.latitude, issue.longitude)
        
        # Only check within 150m radius
        if dist > 150:
            continue

        score = 0
        
        # Category match
        if new_issue.get('category') == issue.category:
            score += 40
            
        # Subcategory match (simplified for demo using title keywords)
        if new_issue.get('subcategory') and issue.subcategory and new_issue.get('subcategory') == issue.subcategory:
            score += 20
            
        # Distance score
        if dist < 50:
            score += 30
        elif dist < 150:
            score += 15
            
        # Severity score
        if abs(new_issue.get('severity', 3) - issue.severity) <= 1:
            score += 10
            
        if score >= 70:
            duplicates.append({'issue': issue, 'score': score})
        elif score >= 40:
            possibly_related.append({'issue': issue, 'score': score})
            
    # Return best match if any
    if duplicates:
        best_match = max(duplicates, key=lambda x: x['score'])
        return {'is_duplicate': True, 'duplicate_of': best_match['issue'].id, 'related': possibly_related}
    
    return {'is_duplicate': False, 'related': possibly_related}
