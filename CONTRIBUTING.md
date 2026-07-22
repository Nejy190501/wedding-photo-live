# Contributing to Wedding Photo Live

First off, thank you for considering contributing to Wedding Photo Live! It's people like you that make open source such a great community.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check if there's already an [Issue](https://github.com/Nejy190501/wedding-photo-live/issues) for it. If not, go ahead and [create one](https://github.com/Nejy190501/wedding-photo-live/issues/new/choose)!

## Fork & create a branch

If this is something you think you can fix, then fork Wedding Photo Live and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-dark-mode
```

## Get the test suite running

Make sure you're using Node.js and npm to match the existing project environment.
Install the dependencies and start the local server:

```sh
npm install
npm run dev
```

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Wedding Photo Live's master branch:

```sh
git remote add upstream https://github.com/Nejy190501/wedding-photo-live.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-dark-mode
git rebase main
git push --set-upstream origin 325-add-dark-mode
```

Finally, go to GitHub and [make a Pull Request](https://github.com/Nejy190501/wedding-photo-live/compare) :D
