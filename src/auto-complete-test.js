const availableCity = ['서울', '부산', '대전', '대구', '광주', '부산'];

$('#city').autocomplete({
  source: availableCity,
  select: (e, ui) => {
    // console.log('select');
    // console.log({ e, ui });
  },
  focus: (e, ui) => {
    // console.log('focus');
    // console.log({ e, ui });
  },
});
