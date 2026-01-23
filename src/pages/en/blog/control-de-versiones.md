---
layout: ../../../layouts/BlogPost.astro
title: "Version Control"
date: "2025-12-23"
description: "A system that records changes made to files over time, allowing you to recall specific versions later."
tags: ["git", "programming", "development", "tools"]
---

Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. For the examples in this book, you will use software source code as the files being version controlled, though in reality you can do this with nearly any type of file on a computer: images, layouts, documents, etc.

## Why use version control?

These systems allow you to:

* Revert selected files back to a previous state
* Revert the entire project back to a previous state
* Compare changes over time
* See who last modified something that might be causing a problem
* See who introduced an issue and when
* Easily recover files if you lose or damage them

## Types of Version Control Systems

### Local Version Control Systems (Local VCS)
**Description:** It is the simplest and most primitive method. Many people manage versions by copying files into another directory (perhaps a time-stamped one).

One popular tool was **RCS**, which works by keeping sets of differences (that is, the differences between files) in a special format on disk, allowing any file to be recreated at any point in time.

**Main problem:** Everything is in one place on your computer, so if you lose that hard drive, you lose the entire project history.

### Centralized Version Control Systems (CVCS)
**Description:** These systems were developed to solve the problem of needing to collaborate with developers on other systems. Examples include CVS, Subversion, and Perforce.

**Characteristics:**
* They have a single server that contains all the versioned files, and a number of clients that check out files from that central place.
* It has been the standard for version control for many years.

**Advantages:**
* Everyone knows to a certain degree what everyone else on the project is doing.
* Administrators have fine-grained control over who can do what.
* It's far easier to administer a CVCS than it is to deal with local databases on every client.

**Critical disadvantages:**
* **Single point of failure:** If the server goes down for an hour, then during that hour nobody can collaborate.
* If the hard disk the central database is on becomes corrupted, and proper backups haven't been kept, you lose absolutely everything (except whatever single snapshots people happen to have on their local machines).

### Distributed Version Control Systems (DVCS)
**Description:** This is where Git, Mercurial, Bazaar or Darcs step in.

**Main characteristics:**
* Clients don't just check out the latest snapshot of the files; rather, they **fully mirror the repository**, including its full history.
* Every developer has a full copy of the project.
* If any server dies, any of the client repositories can be copied back up to the server to restore it.

**Major advantages:**
* Allows working with multiple remote repositories simultaneously.
* You can collaborate with different groups of people in different ways within the same project.
* Allows setting up several types of workflows that aren't possible in centralized systems, such as hierarchical models.
* Greater flexibility in how to collaborate.

## When to use each?

### LOCAL:
* Very small personal projects
* When only YOU are working and don't need to collaborate
* Example: A personal Python script to organize your photos

### CENTRALIZED:
* Small teams with simple flows
* Companies with strict control
* Example: An agency with 5 devs needing supervisor oversight

### DISTRIBUTED (Git):
* Open source projects
* Geographically distributed teams
* Modern development with multiple simultaneous features
* Example: Any tech startup, projects on GitHub

## Comparison of Version Control Systems

| Feature | Local | Centralized | Distributed |
|---|---|---|---|
| Collaboration | ❌ | ✅ | ✅✅ |
| Offline work | ✅ | ❌ | ✅ |
| Speed | ⚡⚡ | 🐌 | ⚡ |
| Full Backup | ❌ | ❌ | ✅ |
| Learning Curve | ✅ | ✅ | 🤔 |

## Tools by type

**LOCAL:**
* RCS (old)
* Manual copies with dates

**CENTRALIZED:**
* SVN (Subversion) 
* Perforce - Gaming industry
* CVS - Legacy systems

**DISTRIBUTED:**
* Git 
* Mercurial
* Bazaar

## Tips to get started

* **If you are learning:** Start with Git
* **If your company uses SVN:** Learn the basics but master Git
* **Git is the industry standard:** Almost all tech jobs ask for Git on the CV
* **Most used platforms:** GitHub, GitLab, Bitbucket all use Git
* **Practice with real projects:** Create a repository on GitHub and upload your personal projects

**Conclusion**

The evolution has been: **Local → Centralized → Distributed**. Each type solves the problems of the previous one: local systems didn't allow collaboration, centralized ones fixed that but created a single point of failure, and distributed ones eliminated that risk by giving every developer a full copy of the project.

---

Source consulted: [Pro Git Book](https://git-scm.com/book/en/v2)
