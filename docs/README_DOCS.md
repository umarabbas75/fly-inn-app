# Booking System Issues - Documentation Index

This folder contains comprehensive documentation about critical issues found in the booking cancellation system.

---

## 📄 Documents Overview

### 1. [REFUND_CALCULATION_DISCREPANCY.md](./REFUND_CALCULATION_DISCREPANCY.md)

**Audience:** Developers, Product Managers  
**Purpose:** Technical analysis of why refund calculations differ

**What's Inside:**

- Side-by-side comparison of manual vs code calculations
- Step-by-step breakdown showing where 43.75% and 37.5% come from
- Root cause analysis (order of operations, Math.floor, policy interpretation)
- Financial impact per booking ($16.16 difference)
- Recommendations for which approach to use
- Proposed code fix

**Key Finding:** The code calculates 37.5% refund but should calculate 43.75% based on policy wording.

---

### 2. [TIMEZONE_FIX_GUIDE.md](./TIMEZONE_FIX_GUIDE.md)

**Audience:** Full-stack Developers, Backend Team, DevOps  
**Purpose:** Complete guide to fixing timezone bugs

**What's Inside:**

- Detailed problem statement with examples
- Backend API changes required (with code samples)
- Frontend code fixes (with complete implementations)
- Migration strategy (phased approach)
- Testing checklist
- **Question template for backend team**
- Timeline estimates

**Key Finding:** System uses user's timezone instead of property timezone, causing inconsistent refunds.

**Critical Action Items:**

- Backend: Add `arrival_datetime` and `departure_datetime` fields
- Backend: Create `/bookings/:id/calculate-refund` endpoint
- Frontend: Update to use dayjs timezone plugin
- Frontend: Display both property time and user's local time

---

### 3. [TIMEZONE_EXPLAINED_SIMPLE.md](./TIMEZONE_EXPLAINED_SIMPLE.md)

**Audience:** Anyone (stakeholders, QA, support team, your mom!)  
**Purpose:** Explain the timezone problem in simple terms

**What's Inside:**

- Story of Alice and Bob cancelling at the same time
- Visual timelines
- Real-world analogies (birthday party, pizza delivery, movie theater)
- "Explain like I'm 5" section
- Examples showing the bug in action
- Simple before/after comparison

**Perfect For:**

- Explaining to non-technical stakeholders
- Training customer support team
- Getting buy-in from management
- Understanding the user impact

---

## 🚨 Priority Summary

### Critical Issues Found:

| Issue                  | Impact                                  | Priority    | Effort  |
| ---------------------- | --------------------------------------- | ----------- | ------- |
| **Timezone Bug**       | Different refunds for same cancellation | 🔴 Critical | 2 weeks |
| **Refund Calculation** | $16.16 less refund per booking          | 🟡 High     | 2 days  |

---

## 🎯 Quick Start

**If you're a...**

### Developer

1. Read [TIMEZONE_FIX_GUIDE.md](./TIMEZONE_FIX_GUIDE.md) for implementation details
2. Read [REFUND_CALCULATION_DISCREPANCY.md](./REFUND_CALCULATION_DISCREPANCY.md) for calculation logic
3. Start with backend changes first

### Product Manager

1. Read [TIMEZONE_EXPLAINED_SIMPLE.md](./TIMEZONE_EXPLAINED_SIMPLE.md) to understand impact
2. Skim [REFUND_CALCULATION_DISCREPANCY.md](./REFUND_CALCULATION_DISCREPANCY.md) for business impact
3. Review recommendations and decide on approach

### QA/Support Team

1. Read [TIMEZONE_EXPLAINED_SIMPLE.md](./TIMEZONE_EXPLAINED_SIMPLE.md) fully
2. Use examples to test edge cases
3. Understand what to tell customers if they report inconsistencies

### Backend Developer

1. Go straight to "Backend Changes Required" section in [TIMEZONE_FIX_GUIDE.md](./TIMEZONE_FIX_GUIDE.md)
2. Read "Question for Backend Team" section
3. Estimate timeline and blockers

### Executive/Stakeholder

1. Read "Executive Summary" sections of each doc
2. Read [TIMEZONE_EXPLAINED_SIMPLE.md](./TIMEZONE_EXPLAINED_SIMPLE.md) "Real Impact" section
3. Review "Priority Summary" above

---

## 📊 Business Impact

### Current State:

- ❌ Inconsistent refunds based on user location
- ❌ Guest from California gets $0, guest from New York gets $100 (same cancellation!)
- ❌ Customer complaints and disputes
- ❌ Lost trust and revenue

### After Fix:

- ✅ Consistent refunds for all users
- ✅ Transparent timezone display
- ✅ Fair and predictable policies
- ✅ Reduced customer service burden

---

## 📞 Who to Contact

**For Technical Questions:**

- Frontend: [Your Frontend Lead]
- Backend: [Your Backend Lead]
- DevOps: [Your DevOps Lead]

**For Business Questions:**

- Product: [Your Product Manager]
- Finance: [Your Finance Team]
- Legal: [Your Legal Team]

**For Customer Impact:**

- Support: [Your Support Lead]
- Success: [Your Customer Success Manager]

---

## 🔄 Next Steps

### Immediate (This Week):

1. [ ] Share docs with relevant teams
2. [ ] Schedule meeting to discuss findings
3. [ ] Get stakeholder approval on approach
4. [ ] Create JIRA tickets for implementation

### Short Term (Next 2 Weeks):

1. [ ] Backend implements timezone-aware endpoints
2. [ ] Frontend updates to use property timezone
3. [ ] QA tests from multiple timezones
4. [ ] Deploy to staging

### Medium Term (Next Month):

1. [ ] Deploy to production with monitoring
2. [ ] Update documentation and help docs
3. [ ] Train support team on new behavior
4. [ ] Communicate changes to users

### Long Term (Next Quarter):

1. [ ] Move all calculations to backend
2. [ ] Remove frontend calculation logic
3. [ ] Add timezone unit tests
4. [ ] Audit other date/time features for similar bugs

---

## 📝 Related Files in Codebase

**Frontend:**

- `app/(dashboard)/dashboard/bookings/[id]/page.tsx` - Booking detail page with refund calculation (lines 88-269)
- `app/(public)/public/stays/[id]/reserve/_components/PaymentSection.tsx` - Payment section
- `utils/timezone.ts` - Timezone utilities

**Backend:**

- `GET /api/bookings/:id` - Needs to add datetime fields
- `POST /api/bookings/:id/cancel` - Needs timezone fix
- `POST /api/bookings/:id/calculate-refund` - NEW endpoint needed

---

## 🧪 Testing Scenarios

### Scenario 1: Same Moment, Different Timezones

- Guest A in New York cancels at 3:00 PM EST
- Guest B in California cancels at 12:00 PM PST (same moment)
- **Expected:** Both get identical refunds
- **Current Bug:** May get different refunds

### Scenario 2: Before vs After Check-in

- Property in Miami, check-in at 2:00 PM EST
- Guest in Tokyo cancels at 4:00 AM JST (3:00 PM EST previous day)
- **Expected:** After check-in (partial refund)
- **Current Bug:** May show before check-in (no refund)

### Scenario 3: Daylight Saving Time

- Property switches from EST to EDT
- Guest cancels during transition
- **Expected:** Handles DST correctly
- **Current Bug:** Unknown (needs testing)

---

## 💰 Financial Analysis

### Per Booking:

- Average booking value: $258.46
- Difference per cancellation: $16.16
- Percentage difference: 6.25%

### At Scale:

- If 100 cancellations/month: **$1,616/month** = **$19,392/year**
- If 1,000 cancellations/month: **$16,160/month** = **$193,920/year**
- If 10,000 cancellations/month: **$161,600/month** = **$1,939,200/year**

_Note: This assumes all cancellations are after check-in. Actual impact varies._

---

## 🎓 Learning Resources

**Understanding Timezones:**

- [MDN: Date and Time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [ISO 8601 Standard](https://en.wikipedia.org/wiki/ISO_8601)
- [IANA Time Zone Database](https://www.iana.org/time-zones)

**Libraries:**

- [Day.js Timezone Plugin](https://day.js.org/docs/en/plugin/timezone)
- [Moment Timezone (if using moment)](https://momentjs.com/timezone/)

**Best Practices:**

- [Timezone Best Practices](https://www.youtube.com/watch?v=-5wpm-gesOY)
- [Working with Dates in JavaScript](https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript/)

---

## ✅ Acceptance Criteria

**The fix is complete when:**

1. [ ] Same cancellation moment → Same refund for all users
2. [ ] UI displays property timezone and user's local time
3. [ ] Backend calculates refunds using property timezone
4. [ ] All tests pass from multiple timezones
5. [ ] Documentation updated
6. [ ] Support team trained
7. [ ] Zero timezone-related support tickets

---

## 📈 Success Metrics

**Track these after deployment:**

- Customer support tickets related to refunds (should decrease)
- Refund disputes (should decrease)
- User satisfaction with cancellation flow (should increase)
- Consistency in refund amounts (should be 100% consistent)

---

## 🐛 Known Edge Cases

1. **Daylight Saving Time transitions**
2. **Properties near timezone boundaries**
3. **International properties with multiple timezones**
4. **User travelling between timezones during booking**
5. **System clock drift on user's device**

---

## 📅 Version History

| Version | Date        | Author       | Changes               |
| ------- | ----------- | ------------ | --------------------- |
| 1.0     | Jan 9, 2026 | AI Assistant | Initial documentation |

---

## 🤝 Contributing

Found another issue? Want to improve these docs?

1. Create a new markdown file in `docs/`
2. Add it to this README
3. Update the related sections
4. Submit for review

---

**Questions?** Contact the development team or create a ticket in JIRA.

**Urgent issue?** Escalate to [Engineering Manager] immediately.
