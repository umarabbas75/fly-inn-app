#!/bin/bash

# Delete All Bookings Script (Bash version)
#
# This script deletes all bookings and their associated blocked dates from the backend.
#
# Usage:
#   ./scripts/delete-all-bookings.sh
#
# Environment Variables Required:
#   - NEXT_PUBLIC_API_URI: Backend API URL
#   - ADMIN_ACCESS_TOKEN: Admin JWT token for authentication

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${NEXT_PUBLIC_API_URI:-http://localhost:3000}"

if [ -z "$ADMIN_ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Error: ADMIN_ACCESS_TOKEN environment variable is required${NC}"
    echo ""
    echo "Usage:"
    echo "  ADMIN_ACCESS_TOKEN=your_token ./scripts/delete-all-bookings.sh"
    echo ""
    echo "Or export it first:"
    echo "  export ADMIN_ACCESS_TOKEN=your_token"
    echo "  ./scripts/delete-all-bookings.sh"
    exit 1
fi

echo -e "${BLUE}🚀 Starting deletion of all bookings and blocked dates...${NC}"
echo ""
echo "API URL: $API_BASE_URL"
echo "────────────────────────────────────────────────────────────"

# Function to make API requests
api_request() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-}
    
    if [ -z "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            "$API_BASE_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE_URL$endpoint"
    fi
}

# Step 1: Fetch all bookings
echo ""
echo -e "${BLUE}📋 Fetching all bookings...${NC}"
bookings_response=$(api_request "/bookings?limit=1000")
bookings_count=$(echo "$bookings_response" | jq -r '.data | length' 2>/dev/null || echo "0")

echo "   Found $bookings_count bookings"

if [ "$bookings_count" = "0" ]; then
    echo -e "${GREEN}✅ No bookings found. Nothing to delete.${NC}"
    exit 0
fi

# Step 2: Delete each booking
echo ""
echo -e "${BLUE}🗑️  Deleting bookings...${NC}"
booking_ids=$(echo "$bookings_response" | jq -r '.data[].id' 2>/dev/null || echo "")

success_count=0
error_count=0

for booking_id in $booking_ids; do
    result=$(api_request "/bookings/$booking_id" "DELETE")
    if echo "$result" | jq -e '.status == true' > /dev/null 2>&1 || echo "$result" | jq -e '.success == true' > /dev/null 2>&1; then
        ((success_count++))
        echo -e "   ${GREEN}✓${NC} Deleted booking #$booking_id"
    else
        ((error_count++))
        error_msg=$(echo "$result" | jq -r '.message' 2>/dev/null || echo "Unknown error")
        echo -e "   ${RED}✗${NC} Failed to delete booking #$booking_id: $error_msg"
    fi
done

echo ""
echo "────────────────────────────────────────────────────────────"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "   Total bookings: $bookings_count"
echo "   Successfully deleted: $success_count"
echo "   Failed: $error_count"

# Step 3: Fetch all stays
echo ""
echo -e "${BLUE}📋 Fetching all stays to clear blocked dates...${NC}"
stays_response=$(api_request "/stays?limit=1000")
stays_count=$(echo "$stays_response" | jq -r '.data | length' 2>/dev/null || echo "0")

echo "   Found $stays_count stays"

if [ "$stays_count" = "0" ]; then
    echo -e "${GREEN}✅ No stays found. Skipping blocked dates cleanup.${NC}"
    exit 0
fi

# Step 4: Clear blocked dates for each stay
echo ""
echo -e "${BLUE}🗑️  Clearing blocked dates...${NC}"
stay_ids=$(echo "$stays_response" | jq -r '.data[].id' 2>/dev/null || echo "")

stays_success_count=0
stays_error_count=0

for stay_id in $stay_ids; do
    result=$(api_request "/stays/$stay_id/blocked-dates" "PATCH" '{"blocked_dates":[]}')
    if echo "$result" | jq -e '.status == true' > /dev/null 2>&1 || echo "$result" | jq -e '.success == true' > /dev/null 2>&1; then
        ((stays_success_count++))
        echo -e "   ${GREEN}✓${NC} Cleared blocked dates for stay #$stay_id"
    else
        ((stays_error_count++))
        error_msg=$(echo "$result" | jq -r '.message' 2>/dev/null || echo "Unknown error")
        echo -e "   ${YELLOW}⚠${NC} Failed to clear blocked dates for stay #$stay_id: $error_msg"
    fi
done

echo ""
echo "────────────────────────────────────────────────────────────"
echo ""
echo -e "${BLUE}📊 Blocked Dates Summary:${NC}"
echo "   Total stays: $stays_count"
echo "   Successfully cleared: $stays_success_count"
echo "   Failed: $stays_error_count"

echo ""
echo -e "${GREEN}✅ Deletion process completed!${NC}"
echo ""














