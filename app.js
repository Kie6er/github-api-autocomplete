const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocomplete-list');
const repositoriesList = document.getElementById('repositories-list');
let debounceTimer;

searchInput.addEventListener('input', function () {
	const inputValue = searchInput.value.trim();
	autocompleteList.innerHTML = '';
	if (inputValue === '') {
		autocompleteList.style.display = 'none';
		return;
	}

	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		fetch(`https://api.github.com/search/repositories?q=${inputValue}`)
			.then(response => response.json())
			.then(data => {
				autocompleteList.innerHTML = '';
				autocompleteList.style.display = 'block';
				data.items.slice(0, 5).forEach(repository => {
					const listItem = document.createElement('div');
					listItem.textContent = repository.name;
					listItem.addEventListener('click', () => {
						addRepository(repository.full_name);
						searchInput.value = '';
						autocompleteList.style.display = 'none';
					});
					autocompleteList.appendChild(listItem);
				});
			})
			.catch(error => console.error('Error fetching repositories:', error));
	}, 400);
});

function addRepository(fullName) {
	fetch(`https://api.github.com/repos/${fullName}`)
		.then(response => response.json())
		.then(repository => {
			console.log(repository)
			const listItem = document.createElement('div');
			listItem.classList.add('repositories-item');
			listItem.insertAdjacentHTML('beforeend', `
				<div class="repositories-item__content">
					<div>Name: ${repository.name}</div>
					<div>Owner: ${repository.owner.login}</div>
					<div>Stars: ${repository.stargazers_count}</div>
				</div>
				<button onclick="removeRepository(this)">
					<svg xmlns="http://www.w3.org/2000/svg" width="46" height="42" viewBox="0 0 46 42" fill="none">
						<path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"/>
						<path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4"/>
					</svg>
				</button>
		`);

			repositoriesList.appendChild(listItem);
		})
		.catch(error => console.error('Error:', error));
}

function removeRepository(button) {
	const listItem = button.parentNode;
	repositoriesList.removeChild(listItem);
}

document.addEventListener('click', function (event) {
	if (event.target !== searchInput && event.target !== autocompleteList) {
		autocompleteList.style.display = 'none';
	}
});
